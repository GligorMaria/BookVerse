import { arrayUnion, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const sendFriendRequest = async (currentUserId, targetUserId) => {
  const targetUserRef = doc(db, "users", targetUserId);
  
  try {
    await updateDoc(targetUserRef, {
      pendingRequests: arrayUnion(currentUserId)
    });
    alert("Cerere trimisă cu succes!");
  } catch (err) {
    console.error("Eroare la trimiterea cererii:", err);
  }
};