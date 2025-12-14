import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function SignOut() {
  const handleLogout = async () => {
    await signOut(auth);
    console.log("User logged out");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
