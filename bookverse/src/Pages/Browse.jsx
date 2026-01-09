import { useState, useEffect } from "react";
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase.js';
import BookCard from '../Components/BookCard';

function Browse() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quote, setQuote] = useState("");

  const mottos = [
    "Reading is a conversation with the finest minds of past centuries.",
    "A book is a dream that you hold in your hands.",
    "Collect moments, not just chapters.",
    "Ink and paper: the only time travel that actually works."
  ];

  useEffect(() => {
    setQuote(mottos[Math.floor(Math.random() * mottos.length)]);

    const unsubscribe = onSnapshot(collection(db, 'books'), (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(booksData);
    });

    return () => unsubscribe();
  }, []);

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#4A443F] font-serif overflow-hidden">

      {/* Floating Decorative Elements */}
      <div className="fixed top-20 left-[10%] w-64 h-64 bg-rose-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-20 right-[10%] w-80 h-80 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse pointer-events-none"></div>

      {/* Hero Section */}
      <header className="relative pt-20 pb-12 px-6 text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[#B8B0A5] mb-4 block">
          Welcome to the BookVerse
        </span>
        <h1 className="text-5xl md:text-7xl font-serif italic mb-6 text-[#4A443F]">
          The Library of Whispers
        </h1>search
        <p className="max-w-xl mx-auto text-[#8C8279] leading-relaxed italic font-light text-lg">
          "{quote}"
        </p>
        <div className="mt-8 flex justify-center items-center gap-4">
          <div className="h-px w-12 bg-[#D4AF37]"></div>
          <span className="text-[#D4AF37] text-xl">❧</span>
          <div className="h-px w-12 bg-[#D4AF37]"></div>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-16 px-6 relative z-10">
        <div className="group relative">
          <input
            placeholder="Search for a soulmate in paper form..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#E8E2D9] rounded-full px-8 py-4 text-sm focus:ring-2 focus:ring-[#E8EEDF] outline-none transition-all shadow-sm italic text-center group-hover:shadow-md"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 group-hover:opacity-100 transition-opacity">
            🔍
          </div>
        </div>
      </div>

      {/* Book Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-10 border-b border-[#F0EDE9] pb-4">
          <h2 className="text-sm uppercase tracking-widest text-[#8C8279]">Currently on the Shelves</h2>
          <p className="text-xs italic text-[#B8B0A5]">{filteredBooks.length} volumes found</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}   
              title={book.title}
              author={book.author}
              coverImageURL={book.coverImageURL}
              description={book.description}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed border-[#F0EDE9] rounded-3xl">
            <p className="text-[#B8B0A5] italic text-xl font-light">
              "Alas, that story has not yet been written in our stars."
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-[#D4AF37] underline text-xs tracking-widest uppercase hover:text-[#4A443F]"
            >
              Clear the search
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#F8F7F2] py-12 border-t border-[#E8E2D9] text-center">
        <div className="max-w-lg mx-auto px-6">
          <p className="text-sm text-[#8C8279] mb-4">
            Curating the infinite since 2025.
          </p>
          <div className="flex justify-center gap-6 text-xs tracking-widest uppercase text-[#B8B0A5]">
            <span className="hover:text-[#D4AF37] cursor-help">The Art of Stillness</span>
            <span>•</span>
            <span className="hover:text-[#D4AF37] cursor-help">The Weight of Ink</span>
            <span>•</span>
            <span className="hover:text-[#D4AF37] cursor-help">The Ethics of Paper</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Browse;
