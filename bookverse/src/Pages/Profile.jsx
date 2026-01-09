import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase/firebase.js";
import SignOut from "../Components/SignOut";


// Helper function to check status
/*const checkAdminStatus = async (user) => {
  if (!user) return false;
  const userDoc = await getDoc(doc(db, "users", user.uid));
  return userDoc.exists() && userDoc.data().role === "admin";
};*/

function Profile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [friendDetails, setFriendDetails] = useState([]); 
  const [profile, setProfile] = useState({
    displayName: "The Unknown Reader",
    photoURL: "",
    occupation: "Wayfarer of Words",
    bio: "A soul composed of ink and afternoon dreams.",
    favoriteGenre: "Magical Realism",
    birthEra: "Early 20th Century",
    friends: [],
    pendingRequests: []
  });

  const currentUser = auth.currentUser;
  const isOwnProfile = !id || id === currentUser?.uid;
  const targetId = isOwnProfile ? currentUser?.uid : id;

  const classyPlaceholder = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=400";

  // 1. Încărcare profil (propriu sau străin)
  useEffect(() => {
    const fetchProfile = async () => {
      if (targetId) {
        const docRef = doc(db, "users", targetId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(prev => ({ ...prev, ...docSnap.data() }));
        }
      }
    };
    fetchProfile();
  }, [targetId]);

  // 2. Traducem lista de ID-uri în date reale + FILTRU ca să nu te vezi pe tine
  useEffect(() => {
    const fetchFriendDetails = async () => {
      if (profile.friends && profile.friends.length > 0) {
        try {
          const details = [];
          for (const fId of profile.friends) {
            // Dacă ID-ul din listă este al meu, îl sar (nu mă adaug ca prietenă)
            if (fId === currentUser?.uid) continue;

            const dRef = doc(db, "users", fId);
            const dSnap = await getDoc(dRef);
            if (dSnap.exists()) {
              details.push({ id: fId, ...dSnap.data() });
            }
          }
          setFriendDetails(details);
        } catch (err) {
          console.error("Error fetching friends:", err);
        }
      } else {
        setFriendDetails([]);
      }
    };
    fetchFriendDetails();
  }, [profile.friends, currentUser?.uid]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !isOwnProfile) return;
    try {
      const storageRef = ref(storage, `avatars/${currentUser.uid}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      setProfile((prev) => ({ ...prev, photoURL: downloadURL }));
    } catch (error) {
      console.error("Storage error:", error);
    }
  };

  const handleSave = async () => {
    if (!isOwnProfile) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), profile);
      setIsEditing(false);
    } catch (err) { console.error(err); }
  };

  const sendFriendRequest = async () => {
    try {
      const targetRef = doc(db, "users", id);
      const myDoc = await getDoc(doc(db, "users", currentUser.uid));
      const myData = myDoc.data();

      await updateDoc(targetRef, {
        pendingRequests: arrayUnion({
          uid: currentUser.uid,
          displayName: myData?.displayName || "A Fellow Reader",
          photoURL: myData?.photoURL || ""
        })
      });
      alert("Invitation sent.");
    } catch (error) { console.error(error); }
  };

  const acceptFriend = async (request) => {
    if (!isOwnProfile) return;
    const isObject = typeof request === 'object' && request !== null;
    const friendId = isObject ? request.uid : request;

    // Protecție extra: nu poți accepta cererea dacă ești chiar tu
    if (friendId === currentUser.uid) return;

    try {
      const myRef = doc(db, "users", currentUser.uid);
      const friendRef = doc(db, "users", friendId);

      await updateDoc(myRef, {
        friends: arrayUnion(friendId),
        pendingRequests: arrayRemove(request) 
      });
      await updateDoc(friendRef, {
        friends: arrayUnion(currentUser.uid)
      });

      setProfile(prev => ({
        ...prev,
        friends: [...(prev.friends || []), friendId],
        pendingRequests: prev.pendingRequests.filter(req => (typeof req === 'object' ? req.uid : req) !== friendId)
      }));
    } catch (err) { console.error(err); }
  };

  const declineFriend = async (request) => {
    if (!isOwnProfile) return;
    try {
      const myRef = doc(db, "users", currentUser.uid);
      await updateDoc(myRef, { pendingRequests: arrayRemove(request) });
      const friendId = typeof request === 'object' ? request.uid : request;
      setProfile(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests.filter(req => (typeof req === 'object' ? req.uid : req) !== friendId)
      }));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#3D3730] font-serif py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 italic text-9xl pointer-events-none select-none">❧</div>

      <div className="max-w-5xl mx-auto border-[12px] border-white shadow-2xl bg-white p-1 md:p-4">
        <div className="border border-[#D9D1C1] p-8 md:p-16">
          
          <header className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-[#D9D1C1] pb-10">
            <div className="text-center md:text-left">
              <h1 className="text-5xl italic font-serif tracking-tighter mb-2">
                {isOwnProfile ? "The Curator’s Journal" : "A Fellow's Journal"}
              </h1>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[#9A8F7E]">Ex Libris • {profile.displayName}</p>
            </div>
            <div className="mt-6 md:mt-0">
              {isOwnProfile && <SignOut />}
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-64 h-80 border-8 border-white shadow-xl rotate-[-2deg] bg-[#E8E2D9] overflow-hidden group">
                <img src={profile.photoURL || classyPlaceholder} className="w-full h-full object-cover sepia-[0.3]" alt="Portrait" />
                {isEditing && isOwnProfile && (
                  <label className="absolute inset-0 bg-[#3D3730]/60 flex items-center justify-center cursor-pointer">
                    <span className="text-white text-[10px] uppercase tracking-widest">Update Portrait</span>
                    <input type="file" className="hidden" onChange={handleAvatarChange} />
                  </label>
                )}
              </div>

              <div className="mt-12 text-center w-full">
                <div className="h-px w-12 bg-[#D4AF37] mx-auto mb-6"></div>
                <h2 className="text-2xl italic mb-1">{profile.displayName}</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9A8F7E] font-medium">{profile.occupation}</p>
                
                {!isOwnProfile && !profile.friends?.includes(currentUser?.uid) && (
                  <button onClick={sendFriendRequest} className="mt-8 px-8 py-2 border border-[#3D3730] text-[10px] uppercase tracking-widest hover:bg-[#3D3730] hover:text-white transition-all">
                    Send Invitation
                  </button>
                )}
              </div>

              {/* Fellows List (Prieteni Reali) */}
              <div className="mt-12 w-full border-t border-[#F0EDE9] pt-8 text-center">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#9A8F7E] mb-4">Fellow Curators</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {friendDetails.length > 0 ? (
                    friendDetails.map((f) => (
                      <Link key={f.id} to={`/profile/${f.id}`} className="w-10 h-10 rounded-full overflow-hidden border border-[#D9D1C1] hover:border-[#D4AF37] transition-all shadow-sm group relative">
                        <img src={f.photoURL || classyPlaceholder} className="w-full h-full object-cover sepia-[0.2] group-hover:sepia-0" alt={f.displayName} />
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white text-[7px] px-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#D9D1C1]">
                          {f.displayName?.split(' ')[0]}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-[10px] italic text-[#9A8F7E]">No companions recorded.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col justify-between">
              {!isEditing ? (
                <div className="space-y-12 relative">
                  {isOwnProfile && (
                    <button onClick={() => setIsEditing(true)} className="absolute -top-4 right-0 text-[10px] uppercase tracking-widest text-[#D4AF37] border-b border-[#D4AF37] pb-1">
                      Edit Manuscript
                    </button>
                  )}

                  <section className="pt-4">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#9A8F7E] mb-6">Manifesto</h3>
                    <p className="text-2xl leading-relaxed italic text-[#5C544B] font-serif">“{profile.bio}”</p>
                  </section>

                  <div className="grid grid-cols-2 gap-12 pt-8 border-t border-[#F0EDE9]">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#9A8F7E] mb-2">Genre Resonance</h3>
                      <p className="text-lg italic">{profile.favoriteGenre}</p>
                    </div>
                    <div>
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#9A8F7E] mb-2">Aesthetic Era</h3>
                      <p className="text-lg italic">{profile.birthEra}</p>
                    </div>
                  </div>

                  {/* Incoming Correspondences */}
                  {isOwnProfile && profile.pendingRequests?.length > 0 && (
                    <div className="mt-12 pt-8 border-t-2 border-double border-[#D9D1C1]">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-6">Incoming Correspondences</h3>
                      <div className="space-y-4">
                        {profile.pendingRequests.map((req, idx) => {
                          const isObj = typeof req === 'object' && req !== null;
                          const name = isObj ? req.displayName : "New Curator";
                          const photo = isObj ? req.photoURL : classyPlaceholder;
                          return (
                            <div key={isObj ? req.uid : idx} className="flex flex-col md:flex-row justify-between items-center bg-[#FAF9F6] p-4 border border-[#D9D1C1] gap-4">
                              <div className="flex items-center gap-3">
                                <img src={photo} className="w-10 h-10 object-cover sepia-[0.3] border border-[#D9D1C1]" alt="" />
                                <span className="text-xs italic tracking-tight">{name} seeks to connect</span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => acceptFriend(req)} className="text-[9px] uppercase tracking-[0.2em] bg-[#3D3730] text-white px-4 py-2 hover:bg-[#D4AF37] transition-all">Accept</button>
                                <button onClick={() => declineFriend(req)} className="text-[9px] uppercase tracking-[0.2em] border border-[#3D3730] text-[#3D3730] px-4 py-2 hover:bg-red-50 transition-all">Decline</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#9A8F7E]">Identity</label>
                      <input value={profile.displayName} onChange={(e) => setProfile({...profile, displayName: e.target.value})} className="w-full bg-transparent border-b border-[#D9D1C1] py-2 outline-none italic" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#9A8F7E]">Role</label>
                      <input value={profile.occupation} onChange={(e) => setProfile({...profile, occupation: e.target.value})} className="w-full bg-transparent border-b border-[#D9D1C1] py-2 outline-none italic" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#9A8F7E]">Manifesto</label>
                    <textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="w-full bg-[#FAF9F6] border border-[#D9D1C1] p-6 h-32 outline-none italic" />
                  </div>
                  <div className="flex gap-6 pt-6">
                    <button onClick={handleSave} className="px-10 py-3 bg-[#3D3730] text-white text-[10px] uppercase tracking-widest hover:bg-[#D4AF37]">Record Changes</button>
                    <button onClick={() => setIsEditing(false)} className="text-[10px] uppercase tracking-widest text-[#9A8F7E]">Discard</button>
                  </div>
                </div>
              )}

              <div className="mt-20 pt-10 border-t border-[#F0EDE9] flex justify-between items-center opacity-40 italic text-xs">
                <span>"Between these pages, I am infinite."</span>
                <span className="text-[9px] uppercase tracking-widest">Archive Ref: {targetId?.substring(0,6)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;