import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";

export default function Review() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userRole, setUserRole] = useState("user");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, "books", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setBook(snap.data());

      if (auth.currentUser) {
        const uSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (uSnap.exists()) setUserRole(uSnap.data().role);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const reviewsRef = collection(db, "books", id, "reviews");
    const unsubscribe = onSnapshot(reviewsRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
    });
    return () => unsubscribe();
  }, [id]);

  const handleSubmit = async () => {
    if (!rating || !reviewText.trim()) return;
    await addDoc(collection(db, "books", id, "reviews"), {
      rating,
      text: reviewText,
      hidden: false, // Default visibility
      createdAt: new Date(),
    });
    setRating(0);
    setReviewText("");
  };

  const toggleHideReview = async (reviewId, currentHidden) => {
    const reviewRef = doc(db, "books", id, "reviews", reviewId);
    await updateDoc(reviewRef, { hidden: !currentHidden });
  };

  if (!book) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#4A443F] font-serif p-12 flex gap-12">
      <div className="w-1/3 flex flex-col items-center">
        <img src={book.coverImageURL} alt={book.title} className="w-full h-[400px] object-cover rounded shadow-md mb-6" />
        <h2 className="text-3xl italic mb-2">{book.title}</h2>
        <p className="text-sm uppercase tracking-widest text-[#8C8279]">by {book.author}</p>
      </div>

      <div className="w-2/3 flex flex-col gap-8">
        <section>
          <h3 className="text-xl uppercase tracking-widest text-[#8C8279] mb-4">Reviews</h3>
          <div className="space-y-4">
            {reviews.map((r) => (
              // If not admin, hide the review if r.hidden is true
              (userRole === "admin" || !r.hidden) && (
                <div key={r.id} className={`bg-white p-4 rounded shadow-sm border ${r.hidden ? 'opacity-50 border-red-200' : 'border-[#E8E2D9]'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[#D4AF37] mb-1">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                        <p className="italic text-sm text-[#6B635C]">{r.text}</p>
                    </div>
                    {userRole === "admin" && (
                        <button 
                            onClick={() => toggleHideReview(r.id, r.hidden)}
                            className="text-[10px] uppercase text-red-400 hover:underline"
                        >
                            {r.hidden ? "Unhide" : "Hide"}
                        </button>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl uppercase tracking-widest text-[#8C8279] mb-4">Give a Review</h3>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`cursor-pointer text-2xl ${(hoverRating || rating) >= star ? "text-[#D4AF37]" : "text-[#E8E2D9]"}`}
                onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star)}>★</span>
            ))}
          </div>
          <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your thoughts..." className="w-full h-32 p-4 border border-[#E8E2D9] rounded resize-none mb-4" />
          <div className="flex justify-end">
            <button onClick={handleSubmit} className="bg-[#D4AF37] text-white px-6 py-2 rounded uppercase text-xs tracking-widest hover:bg-[#4A443F]">Submit</button>
          </div>
        </section>
      </div>
    </div>
  );
}