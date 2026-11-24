import { Link } from 'react-router-dom';

// Shown for any address that is not a page in the app, instead of a blank screen.
export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center px-6 text-center font-serif">
            <span className="text-4xl text-[#D4AF37] mb-6">❧</span>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#A39181] mb-4">Page not found</p>
            <h1 className="text-4xl md:text-5xl italic text-[#4A443F] mb-4">This chapter is missing</h1>
            <p className="italic text-[#8C8279] max-w-md mb-10">
                The page you were looking for is not in the archives. It may have moved, or the link is out of date.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <Link
                    to="/"
                    className="px-6 py-2 border border-[#D4AF37] text-[10px] uppercase tracking-widest text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-white transition-all duration-500"
                >
                    Home
                </Link>
                <Link
                    to="/browse"
                    className="px-6 py-2 border border-[#E8E2D9] text-[10px] uppercase tracking-widest text-[#8C8279] rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-500"
                >
                    Browse books
                </Link>
            </div>
        </div>
    );
}
