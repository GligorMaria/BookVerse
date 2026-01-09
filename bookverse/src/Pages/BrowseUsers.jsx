import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, arrayUnion, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase.js";
import { Link } from "react-router-dom";

function BrowseUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== currentUser?.uid) {
            usersList.push({ id: doc.id, ...doc.data() });
          }
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const sendRequest = async (targetUserId) => {
    try {
      // 1. Luăm datele TALE de profil din Firestore pentru a trimite numele corect
      const myDocRef = doc(db, "users", currentUser.uid);
      const myDocSnap = await getDoc(myDocRef);
      const myData = myDocSnap.exists() ? myDocSnap.data() : {};

      // 2. Referința către persoana căreia îi trimiți cererea
      const targetRef = doc(db, "users", targetUserId);
      
      // 3. Trimitem un OBIECT, nu doar un ID
      await updateDoc(targetRef, {
        pendingRequests: arrayUnion({
          uid: currentUser.uid,
          displayName: myData.displayName || "The Unknown Reader",
          photoURL: myData.photoURL || ""
        })
      });

      alert(`Invitation from ${myData.displayName || "you"} sent through the ether.`);
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Could not send invitation.");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center italic">Consulting the archives...</div>;

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#3D3730] font-serif py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl italic mb-2">Fellow Curators</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9A8F7E]">Discover other souls in the BookVerse</p>
          <div className="h-px w-24 bg-[#D4AF37] mx-auto mt-6"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((u) => (
            <div key={u.id} className="bg-white border border-[#D9D1C1] p-6 shadow-sm hover:shadow-md transition-all group">
              {/* Acum poți apăsa pe poză/nume să îi vezi profilul */}
              <Link to={`/profile/${u.id}`} className="flex items-center gap-4 mb-4 cursor-pointer">
                <img 
                  src={u.photoURL || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100"} 
                  className="w-12 h-12 object-cover sepia-[0.3] border border-[#D9D1C1] group-hover:sepia-0 transition-all"
                  alt={u.displayName}
                />
                <div>
                  <h2 className="italic text-lg group-hover:text-[#D4AF37] transition-colors">{u.displayName || "Anonymous Reader"}</h2>
                  <p className="text-[9px] uppercase tracking-widest text-[#9A8F7E]">{u.occupation || "Wanderer"}</p>
                </div>
              </Link>
              
              <p className="text-xs italic text-[#5C544B] mb-6 line-clamp-2 h-8">
                "{u.bio || "No manifesto written yet."}"
              </p>

              <button 
                onClick={() => sendRequest(u.id)}
                className="w-full py-2 bg-[#3D3730] text-white text-[9px] uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all"
              >
                Send Invitation
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrowseUsers;