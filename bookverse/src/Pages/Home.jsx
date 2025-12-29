import { Link } from 'react-router-dom';

function Home() {
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
          <div className="flex flex-wrap justify-center gap-6">
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
        </main>

        {/* --- Footer Philosophical Note --- */}
        <footer className="absolute bottom-10 w-full text-center">
          <p className="text-xs text-gray-400 font-serif tracking-widest uppercase">
            Est. 2025 • The Art of Slow Reading
          </p>
        </footer>
      </div>
  );
}

export default Home;