import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import BookCard from './components/BookCard';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);

  // 🔁 Real-time Firestore sync
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'books'), (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(booksData);
    });
    return () => unsubscribe();
  }, []);

  // 📤 Add book to Firestore + upload cover
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!title || !author) return;

    let coverUrl = null;

    if (file) {
      const storageRef = ref(storage, `covers/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      coverUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, 'books'), {
      title,
      author,
      coverUrl,
      createdAt: new Date()
    });

    setTitle("");
    setAuthor("");
    setFile(null);
  };

  // 🔍 Filter books by search term
  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">BookVerse 📚</h1>

      <form onSubmit={handleAddBook} className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 border rounded w-48"
        />
        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="px-3 py-2 border rounded w-48"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-48"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Book
        </button>
      </form>

      <input
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 border rounded w-72 mb-6"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            description={book.coverUrl ? "Cover uploaded" : "No cover"}
          />
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-gray-500">No books found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
