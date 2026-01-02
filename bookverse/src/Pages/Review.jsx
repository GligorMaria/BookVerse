import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Review() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Load book data
  useEffect(() => {
    const fetchBook = async () => {
      const ref = doc(db, "books", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setBook(snap.data());
      }
    };
    fetchBook();
  }, [id]);

  // Load reviews for this book
  useEffect(() => {
    const reviewsRef = collection(db, "books", id, "reviews");
    const unsubscribe = onSnapshot(reviewsRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
    });
    return () => unsubscribe();
  }, [id]);

  // Submit review
  const handleSubmit = async () => {
    if (!rating || !reviewText.trim()) return;

    await addDoc(collection(db, "books", id, "reviews"), {
      rating,
      text: reviewText,
      createdAt: new Date(),
    });

    setRating(0);
    setReviewText("");
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#4A443F]">
        Loading book...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#4A443F] font-serif p-12 flex gap-12">
      
      {/* Left: Book Info */}
      <div className="w-1/3 flex flex-col items-center">
        <img
          src={book.coverImageURL}
          alt={book.title}
          className="w-full h-[400px] object-cover rounded shadow-md mb-6"
        />
        <h2 className="text-3xl italic mb-2">{book.title}</h2>
        <p className="text-sm uppercase tracking-widest text-[#8C8279]">
          by {book.author}
        </p>
      </div>

      {/* Right: Reviews + Form */}
      <div className="w-2/3 flex flex-col gap-8">
        
        {/* Existing Reviews */}
        <section>
          <h3 className="text-xl uppercase tracking-widest text-[#8C8279] mb-4">
            Reviews
          </h3>

          {reviews.length === 0 ? (
            <p className="italic text-[#B8B0A5]">No reviews on this book yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-4 rounded shadow-sm border border-[#E8E2D9]"
                >
                  <p className="text-[#D4AF37] mb-1">
                    {"★".repeat(r.rating)}{" "}
                    {"☆".repeat(5 - r.rating)}
                  </p>
                  <p className="italic text-sm text-[#6B635C]">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Review Form */}
        <section>
          <h3 className="text-xl uppercase tracking-widest text-[#8C8279] mb-4">
            Give a Review
          </h3>

          {/* Star Rating */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-2xl ${
                  (hoverRating || rating) >= star
                    ? "text-[#D4AF37]"
                    : "text-[#E8E2D9]"
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          {/* Textbox */}
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full h-32 p-4 border border-[#E8E2D9] rounded resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E8EEDF] mb-4"
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-[#D4AF37] text-white px-6 py-2 rounded uppercase text-xs tracking-widest hover:bg-[#4A443F] transition-colors"
            >
              Submit
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
