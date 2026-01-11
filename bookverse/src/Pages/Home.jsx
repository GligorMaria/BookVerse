import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [dailyQuote, setDailyQuote] = useState({ text: "", author: "" });

  useEffect(() => {
    const quotes = [
      { text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
      { text: "Reading is essential for those who seek to rise above the ordinary.", author: "Jim Rohn" },
      { text: "Books are a uniquely portable magic.", author: "Stephen King" },
      { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
      { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
      { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
      { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" }
    ];

    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % quotes.length;
    
    setDailyQuote(quotes[quoteIndex]);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center px-4 overflow-hidden relative">

      {/* --- Decorative Elements --- */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      {/* --- Hero Content --- */}
      <main className="max-w-4xl text-center z-10">
        <h2 className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4 font-light">
          A Sanctuary for the Wandering Mind
        </h2>

        <h1 className="text-6xl md:text-8xl font-serif text-[#4A443F] mb-6 italic leading-tight">
          BookVerse
        </h1>

        <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mb-10 italic">
          "Between the pages of a book is a lovely place to be. Explore the archives of human thought, one chapter at a time."
        </p>

        {/* --- Playful Fancy Buttons --- */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <Link
            to="/browse"
            className="group relative px-8 py-3 font-medium text-[#4A443F] transition-all duration-300"
          >
            <span className="relative z-10">Step Inside</span>
            <div className="absolute inset-0 bg-[#E8EEDF] transform skew-x-12 group-hover:skew-x-0 transition-transform duration-300 rounded-lg"></div>
          </Link>

          <Link
            to="/mybooks"
            className="group relative px-8 py-3 font-medium text-[#4A443F] transition-all duration-300"
          >
            <span className="relative z-10">Your Archive</span>
            <div className="absolute inset-0 border-2 border-[#D8E2DC] transform -skew-x-12 group-hover:skew-x-0 transition-transform duration-300 rounded-lg"></div>
          </Link>
        </div>

        {/* --- Enhanced Quote Section with Background Image --- */}
        <div className="mt-12 relative max-w-2xl mx-auto group">
          <div 
            className="relative overflow-hidden rounded-2xl p-10 md:p-14 shadow-sm border border-gray-100 transition-transform duration-500 hover:scale-[1.01]"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1000')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] group-hover:bg-white/75 transition-colors duration-500"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center justify-center gap-3">
                <span className="w-8 h-[1px] bg-gray-200"></span>
                Quote of the Day
                <span className="w-8 h-[1px] bg-gray-200"></span>
              </div>
              
              <p className="text-xl md:text-2xl text-[#4A443F] font-serif italic mb-6 leading-relaxed">
                "{dailyQuote.text}"
              </p>
              
              <p className="text-xs text-gray-500 font-light tracking-[0.2em] uppercase">
                — {dailyQuote.author} —
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="absolute bottom-10 w-full text-center">
        <p className="text-xs text-gray-400 font-serif tracking-widest uppercase">
          Est. 2025 • The Art of Slow Reading
        </p>
      </footer>
    </div>
  );
}

export default Home;