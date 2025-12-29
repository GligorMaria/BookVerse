import { useEffect, useState } from 'react';
import { db, storage } from '../firebase/firebase.js';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function BookList() {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'books'), (snapshot) => {
            const bookData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBooks(bookData);
        });
        return () => unsubscribe();
    }, []);

    const handleAddBook = async (e) => {
        e.preventDefault();
        if (!title || !author) return;

        setLoading(true);
        // Using an elegant default book placeholder
        let coverUrl = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop";

        try {
            if (file) {
                const storageRef = ref(storage, `covers/${Date.now()}-${file.name}`);
                const uploadResult = await uploadBytes(storageRef, file);
                coverUrl = await getDownloadURL(uploadResult.ref);
            }

            await addDoc(collection(db, 'books'), {
                title,
                author,
                coverImageURL: coverUrl,
                createdAt: new Date()
            });

            setTitle("");
            setAuthor("");
            setFile(null);
        } catch (error) {
            console.error("Storage restricted:", error);
            // Graceful fallback if Firebase Storage is still throwing that regional error
            await addDoc(collection(db, 'books'), {
                title,
                author,
                coverImageURL: coverUrl,
                createdAt: new Date()
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FCFAF7] font-serif text-[#4A443F] pb-20">
            {/* --- Header Section --- */}
            <header className="py-16 text-center">
                <h1 className="text-4xl md:text-5xl italic mb-2">My Private Archive</h1>
                <p className="text-[#A39181] text-xs uppercase tracking-[0.3em]">Personal treasures and silent friends</p>
                <div className="mt-6 flex justify-center gap-2">
                    <span className="w-1 h-1 bg-[#D4AF37] rounded-full"></span>
                    <span className="w-1 h-1 bg-[#D4AF37] rounded-full opacity-50"></span>
                    <span className="w-1 h-1 bg-[#D4AF37] rounded-full opacity-25"></span>
                </div>
            </header>

            {/* --- Fancy Scriptorium Form --- */}
            <div className="max-w-4xl mx-auto px-4 mb-20">
                <form onSubmit={handleAddBook} className="bg-white border border-[#E8E2D9] p-8 md:p-12 rounded-sm shadow-sm relative overflow-hidden">
                    {/* Decorative Background Icon */}
                    <div className="absolute -right-8 -bottom-8 text-9xl text-gray-50 opacity-50 pointer-events-none italic">✎</div>

                    <h2 className="text-xl italic mb-10 text-center text-[#6B635C]">Add a new companion to your collection</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                        <div className="relative group">
                            <input
                                placeholder="The Title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent border-b border-[#D8D2C9] py-2 outline-none focus:border-[#D4AF37] transition-colors italic"
                            />
                        </div>
                        <div className="relative group">
                            <input
                                placeholder="The Author's Pen..."
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full bg-transparent border-b border-[#D8D2C9] py-2 outline-none focus:border-[#D4AF37] transition-colors italic"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[#F5F2EE] pt-8">
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-[#FDF1F2] hover:bg-[#F9E4E6] text-[#A67B7F] px-4 py-2 rounded-full text-[10px] tracking-widest uppercase transition-colors">
                                {file ? `✓ ${file.name.substring(0,10)}...` : "Choose a Cover"}
                                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                            </label>
                            {file && <span className="text-[10px] italic text-gray-400 font-sans">Ready to bind</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-12 py-3 rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-500 ${
                                loading
                                    ? 'bg-gray-100 text-gray-400'
                                    : 'bg-[#4A443F] text-white hover:bg-[#D4AF37] hover:tracking-[0.3em] shadow-lg'
                            }`}
                        >
                            {loading ? "Inscribing..." : "Add to Archive"}
                        </button>
                    </div>
                </form>
            </div>

            {/* --- The Archive Display --- */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {books.map(book => (
                    <div key={book.id} className="group flex flex-col items-center">
                        <div className="relative w-full aspect-[2/3] mb-4 overflow-hidden shadow-md group-hover:shadow-2xl transition-shadow duration-500">
                            <img
                                src={book.coverImageURL || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop"}
                                alt={book.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 grayscale-[30%] group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 border-[15px] border-white/10 group-hover:border-none transition-all"></div>
                        </div>
                        <h3 className="text-lg italic text-[#4A443F] text-center mb-1">{book.title}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-[#A39181]">{book.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}