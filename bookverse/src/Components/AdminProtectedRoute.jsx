import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null); // null = loading, false = denied, true = allowed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check Firestore for admin role
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center italic">Consulting the gatekeeper...</div>;

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;