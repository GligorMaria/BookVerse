import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      const docRef = doc(db, "books", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBook(docSnap.data());
      } else {
        console.log("No such book!");
      }
      setLoading(false);
    };

    fetchBook();
  }, [id]);

  if (loading) return <div className="text-center py-20 italic">Consulting the archives...</div>;
  if (!book) return <div className="text-center py-20 italic">This story has vanished.</div>;

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#4A443F] font-serif py-20 px-6">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-12 text-xs uppercase tracking-widest text-[#B8B0A5] hover:text-[#D4AF37]"
      >
        ← Return to Library
      </button>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* Book Cover */}
        <div className="shadow-2xl rounded-sm overflow-hidden border border-[#E8E2D9]">
          <img 
            src={book.coverImageURL} 
            alt={book.title} 
            className="w-full h-auto object-cover" 
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#B8B0A5] mb-2 block">
              Volume Details
            </span>
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