import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    displayName: "The Unknown Reader",
    photoURL: "",
    occupation: "Wayfarer of Words",
    bio: "A soul composed of ink and afternoon dreams.",
    favoriteGenre: "Magical Realism",
    birthEra: "Early 20th Century", // More magical than 'Age'
  });

  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProfile(docSnap.data());
      }
    };
    fetchProfile();
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      setProfile((prev) => ({ ...prev, photoURL: downloadURL }));
    } catch (error) {
      console.error("Storage error:", error);
      alert("Note: The ethereal storage is currently locked in your region. Please use an Image URL.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "users", user.uid), profile);
      setIsEditing(false);
    } catch (err) { console.error(err); }
  };

  // Classy placeholder: A silhouette or an old paper texture
  const classyPlaceholder = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=400";

  return (
      <div className="min-h-screen bg-[#F4F1EA] text-[#3D3730] font-serif py-16 px-6 relative overflow-hidden">

        {/* Decorative Background Flourish */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none select-none italic text-9xl">❧</div>

        <div className="max-w-5xl mx-auto border-[12px] border-white shadow-2xl bg-white p-1 md:p-4">
          <div className="border border-[#D9D1C1] p-8 md:p-16">

            <header className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-[#D9D1C1] pb-10">
              <div className="text-center md:text-left">
                <h1 className="text-5xl italic font-serif tracking-tighter mb-2">The Curator’s Journal</h1>
                <p className="text-[11px] uppercase tracking-[0.4em] text-[#9A8F7E]">Ex Libris • {user?.email}</p>
              </div>
              <div className="mt-6 md:mt-0">
                <SignOut />
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

              {/* Left: The Portrait */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="relative w-64 h-80 border-8 border-white shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-700 bg-[#E8E2D9] overflow-hidden group">
                  <img
                      src={profile.photoURL || classyPlaceholder}
                      alt="Portrait"
                      className="w-full h-full object-cover sepia-[0.3] group-hover:sepia-0 transition-all duration-700"
                  />
                  {isEditing && (
                      <label className="absolute inset-0 bg-[#3D3730]/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-[10px] uppercase tracking-widest">Update Portrait</span>
                        <input type="file" className="hidden" onChange={handleAvatarChange} />
                      </label>
                  )}
                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.3)] pointer-events-none"></div>
                </div>

                <div className="mt-12 text-center w-full">
                  <div className="h-px w-12 bg-[#D4AF37] mx-auto mb-6"></div>
                  <h2 className="text-2xl italic mb-1">{profile.displayName}</h2>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9A8F7E] font-medium">{profile.occupation}</p>
                </div>
              </div>

              {/* Right: The Ink */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                {!isEditing ? (
                    <div className="space-y-12 relative">
                      <button
                          onClick={() => setIsEditing(true)}
                          className="absolute -top-4 right-0 text-[10px] uppercase tracking-widest text-[#D4AF37] border-b border-[#D4AF37] pb-1"
                      >
                        Edit Manuscript
                      </button>

                      <section className="pt-4">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#9A8F7E] mb-6">Manifesto</h3>
                        <p className="text-2xl leading-relaxed italic text-[#5C544B] font-serif">
                          “{profile.bio}”
                        </p>
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
                    </div>
                ) : (
                    <div className="space-y-8 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-[#9A8F7E]">Identity</label>
                          <input
                              value={profile.displayName}
                              onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                              className="w-full bg-transparent border-b border-[#D9D1C1] py-2 focus:border-[#D4AF37] outline-none italic"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-[#9A8F7E]">Role</label>
                          <input
                              value={profile.occupation}
                              onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                              className="w-full bg-transparent border-b border-[#D9D1C1] py-2 focus:border-[#D4AF37] outline-none italic"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#9A8F7E]">Manifesto</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                            className="w-full bg-[#FAF9F6] border border-[#D9D1C1] p-6 outline-none focus:border-[#D4AF37] italic h-32 leading-relaxed"
                        />
                      </div>

                      <div className="flex gap-6 pt-6">
                        <button onClick={handleSave} className="px-10 py-3 bg-[#3D3730] text-white text-[10px] uppercase tracking-widest hover:bg-[#D4AF37] transition-all">Record Changes</button>
                        <button onClick={() => setIsEditing(false)} className="text-[10px] uppercase tracking-widest text-[#9A8F7E]">Discard</button>
                      </div>
                    </div>
                )}

                {/* Philosophical Note */}
                <div className="mt-20 pt-10 border-t border-[#F0EDE9] flex justify-between items-center opacity-40 italic text-xs">
                  <span>"Between these pages, I am infinite."</span>
                  <span className="text-[9px] uppercase tracking-widest tracking-widest">Archive Ref: {user?.uid.substring(0,6)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Profile;