export default function BookCard({ title, author, description, coverImageURL }) {
    return (
        <div className="group relative bg-[#FCFAF7] border border-[#E8E2D9] rounded-sm p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full shadow-[0_4px_12px_rgba(0,0,0,0.05)]">

            {/* Decorative Corner Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Book Cover Container */}
            <div className="relative mb-6 overflow-hidden rounded-sm shadow-inner bg-[#F3EFE9]">
                <img
                    src={coverImageURL || "https://images.unsplash.com/photo-1543005139-7640e7419874?q=80&w=1000&auto=format&fit=crop"}
                    alt={title}
                    className="w-full h-72 object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A443F]/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="flex-grow flex flex-col items-center text-center">
                <h2 className="text-2xl font-serif text-[#4A443F] mb-1 leading-tight italic">
                    {title}
                </h2>

                <div className="w-12 h-[1px] bg-[#D4AF37] my-3"></div>

                <p className="text-xs uppercase tracking-[0.2em] text-[#8C8279] mb-4 font-medium">
                    by {author}
                </p>

                <p className="text-sm text-[#6B635C] leading-relaxed font-light line-clamp-3 italic italic-font">
                    {description || "A silent conversation between the author and your soul."}
                </p>
            </div>

            {/* Fancy Interactive Footer */}
            <div className="mt-6 pt-4 border-t border-[#F0EDE9] flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="text-[10px] uppercase tracking-widest text-[#D4AF37] hover:text-[#4A443F] transition-colors">
                    View Notes
                </button>
                <span className="text-[10px] text-gray-400 italic">Book No. {Math.floor(Math.random() * 1000)}</span>
            </div>
        </div>
    );
}