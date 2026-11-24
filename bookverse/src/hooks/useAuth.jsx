import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Makes sure every signed-in user has a users/{uid} document (Google sign-in
// never created one) and returns the user's role.
async function ensureProfile(firebaseUser) {
  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data().role || "user";
  await setDoc(ref, {
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName || "A Fellow Reader",
    photoURL: firebaseUser.photoURL || "",
    role: "user",
    friends: [],
    pendingRequests: [],
    createdAt: new Date(),
  });
  return "user";
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          setRole(await ensureProfile(firebaseUser));
        } catch (err) {
          console.error("Could not load the user profile:", err);
          setRole("user");
        }
        // Leave the sign-in pages after logging in; otherwise stay where the user is
        if (["/login", "/signup"].includes(window.location.pathname)) {
          navigate("/books", { replace: true });
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const value = useMemo(
    () => ({ user, role, isAdmin: role === "admin", loading, logout }),
    [user, role, loading]
  );

  if (loading) return <div>Loading Application...</div>;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
