import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore"; // Added deleteDoc
import { db, auth } from "../firebase/firebase.js"; // Added auth

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("user"); // Track role

  useEffect(() => {
    const fetchBookAndRole = async () => {
      // Fetch Book
      const docRef = doc(db, "books", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBook(docSnap.data());
      }

      // Fetch User Role
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        }
      }
      setLoading(false);
    };

    fetchBookAndRole();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to remove this book from the archives?")) {
      try {
        await deleteDoc(doc(db, "books", id));
        navigate("/browse"); // Or your main library page
      } catch (err) {
        alert("Error deleting book: " + err.message);
      }
    }
  };

  if (loading) return <div className="text-center py-20 italic">Consulting the archives...</div>;
  if (!book) return <div className="text-center py-20 italic">This story has vanished.</div>;

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#4A443F] font-serif py-20 px-6">
      <div className="flex justify-between max-w-4xl mx-auto items-center mb-12">
        <button 
          onClick={() => navigate(-1)} 
          className="text-xs uppercase tracking-widest text-[#B8B0A5] hover:text-[#D4AF37]"
        >
          ← Return to Library
        </button>
        
        {/* Admin Delete Button */}
        {userRole === "admin" && (
          <button 
            onClick={handleDelete}
            className="text-xs uppercase tracking-widest text-red-400 hover:text-red-600 border border-red-200 px-4 py-1 rounded"
          >
            Delete Volume
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div className="shadow-2xl rounded-sm overflow-hidden border border-[#E8E2D9]">
          <img src={book.coverImageURL} alt={book.title} className="w-full h-auto object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#B8B0A5] mb-2 block">Volume Details</span>
            <h1 className="text-5xl font-serif italic mb-2">{book.title}</h1>
            <p className="text-lg text-[#8C8279] italic">by {book.author}</p>
          </div>
          <div className="h-px w-24 bg-[#D4AF37]"></div>
          <div className="prose prose-stone">
            <p className="text-[#6B635C] leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left">
              {book.description}
            </p>
          </div>
          <div className="pt-8 flex gap-4">
            <button className="px-8 py-3 bg-[#4A443F] text-white text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition-colors">
              Add to Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;