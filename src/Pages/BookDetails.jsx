import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const docRef = doc(db, "books", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBook(docSnap.data());
      }
    };
    fetchBook();
  }, [id]);

  if (!book) {
    return <p className="p-6">Loading book details...</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      {book.coverUrl && (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
      <p className="text-gray-700 mb-2">by {book.author}</p>
      {book.createdAt && (
        <p className="text-gray-500">
          Added on: {book.createdAt.toDate().toDateString()}
        </p>
      )}
    </div>
  );
}
