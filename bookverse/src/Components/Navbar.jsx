import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SignOut from './SignOut.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const styles = {
    // Delicate link style with gold hover and tracking
    link: "text-[11px] uppercase tracking-[0.3em] text-[#8C8279] hover:text-[#D4AF37] transition-all duration-500 relative py-1 group",
    activeLink: "text-[#4A443F]",
    signIn: "px-6 py-2 border border-[#D4AF37] text-[10px] uppercase tracking-widest text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-white transition-all duration-500",
};

const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse' },
];

// Visible only when the user is signed in
const memberLinks = [
    { to: '/books', label: 'My Archive' },
    { to: '/curators', label: 'Fellows' },
    { to: '/profile', label: 'Curator' },
];

function Navbar() {
    const { user } = useAuth();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    // Close the phone menu whenever the page changes
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Helper to check if a link is active
    const isActive = (path) => location.pathname === path;

    const links = user ? [...publicLinks, ...memberLinks] : publicLinks;

    const authControl = user ? (
        <SignOut />
    ) : (
        <Link to="/login" className={styles.signIn}>
            Sign In
        </Link>
    );

    return (
        <div className="bg-[#FDFCF8]/90 backdrop-blur-sm sticky top-0 z-50 border-b border-[#F0EDE9] shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
            <div className="px-5 md:px-8 py-5 flex justify-between items-center">

                {/* --- Logo: The Signature --- */}
                <Link to="/" className="flex items-center gap-2 group">
                    <h2 className="text-2xl font-serif italic text-[#4A443F] tracking-tight transition-all duration-500 group-hover:tracking-wider">
                        Book<span className="text-[#D4AF37]">Verse</span>
                    </h2>
                    <span className="text-xl opacity-80 group-hover:rotate-12 transition-transform duration-500">❧</span>
                </Link>

                {/* --- Navigation: The Index (wide screens) --- */}
                <nav className="hidden md:flex items-center space-x-10">
                    {links.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`${styles.link} ${isActive(to) ? styles.activeLink : ''}`}
                        >
                            {label}
                            <span className={`absolute bottom-0 left-0 h-[1px] bg-[#D4AF37] transition-all duration-500 ${isActive(to) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </Link>
                    ))}

                    {/* --- Authentication State --- */}
                    <div className="ml-6 pl-6 border-l border-[#E8E2D9]">
                        {authControl}
                    </div>
                </nav>

                {/* --- Menu button (phones) --- */}
                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="md:hidden p-2 -mr-2 text-[#4A443F]"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        {menuOpen ? (
                            <path d="M6 6l12 12M18 6L6 18" />
                        ) : (
                            <path d="M4 7h16M4 12h16M4 17h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* --- Navigation: The Index (phones) --- */}
            {menuOpen && (
                <nav className="md:hidden border-t border-[#F0EDE9] px-5 pb-6 pt-2 flex flex-col">
                    {links.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`${styles.link} py-3 ${isActive(to) ? `${styles.activeLink} border-l-2 border-[#D4AF37] pl-3` : ''}`}
                        >
                            {label}
                        </Link>
                    ))}
                    <div className="pt-4 mt-2 border-t border-[#E8E2D9]">
                        {authControl}
                    </div>
                </nav>
            )}
        </div>
    );
}

export default Navbar;
