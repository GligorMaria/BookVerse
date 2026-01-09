import { Link, useLocation } from 'react-router-dom';
import SignOut from './SignOut.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const styles = {
    // Delicate link style with gold hover and tracking
    link: "text-[11px] uppercase tracking-[0.3em] text-[#8C8279] hover:text-[#D4AF37] transition-all duration-500 relative py-1 group",
    activeLink: "text-[#4A443F]",
};

function Navbar() {
    const { user } = useAuth();
    const location = useLocation();

    // Helper to check if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <div className="bg-[#FDFCF8]/90 backdrop-blur-sm sticky top-0 z-50 border-b border-[#F0EDE9] px-8 py-5 flex justify-between items-center shadow-[0_2px_15px_rgba(0,0,0,0.02)]">

            {/* --- Logo: The Signature --- */}
            <Link to="/" className="flex items-center gap-2 group">
                <h2 className="text-2xl font-serif italic text-[#4A443F] tracking-tight transition-all duration-500 group-hover:tracking-wider">
                    Book<span className="text-[#D4AF37]">Verse</span>
                </h2>
                <span className="text-xl opacity-80 group-hover:rotate-12 transition-transform duration-500">❧</span>
            </Link>

            {/* --- Navigation: The Index --- */}
            <nav className="flex items-center space-x-10">
                <Link
                    to="/"
                    className={`${styles.link} ${isActive('/') ? styles.activeLink : ''}`}
                >
                    Home
                    <span className={`absolute bottom-0 left-0 h-[1px] bg-[#D4AF37] transition-all duration-500 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>

                <Link
                    to="/browse"
                    className={`${styles.link} ${isActive('/browse') ? styles.activeLink : ''}`}
                >
                    Browse
                    <span className={`absolute bottom-0 left-0 h-[1px] bg-[#D4AF37] transition-all duration-500 ${isActive('/browse') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>

                {/* --- Secțiune vizibilă doar dacă user-ul este logat --- */}
                {user && (
                    <>
                        <Link
                            to="/books"
                            className={`${styles.link} ${isActive('/books') ? styles.activeLink : ''}`}
                        >
                            My Archive
                            <span className={`absolute bottom-0 left-0 h-[1px] bg-[#D4AF37] transition-all duration-500 ${isActive('/books') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </Link>

                        {/* --- LINK NOU: Fellow Curators --- */}
                        <Link
                            to="/curators"
                            className={`${styles.link} ${isActive('/curators') ? styles.activeLink : ''}`}
                        >
                            Fellows
                            <span className={`absolute bottom-0 left-0 h-[1px] bg-[#D4AF37] transition-all duration-500 ${isActive('/curators') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </Link>

                        <Link
                            to="/profile"
                            className={`${styles.link} ${isActive('/profile') ? styles.activeLink : ''}`}
                        >
                            Curator
                            <span className={`absolute bottom-0 left-0 h-[1px] bg-[#D4AF37] transition-all duration-500 ${isActive('/profile') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </Link>
                    </>
                )}

                {/* --- Authentication State --- */}
                <div className="ml-6 pl-6 border-l border-[#E8E2D9]">
                    {user ? (
                        <SignOut />
                    ) : (
                        <Link
                            to="/login"
                            className="px-6 py-2 border border-[#D4AF37] text-[10px] uppercase tracking-widest text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-white transition-all duration-500"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Navbar;