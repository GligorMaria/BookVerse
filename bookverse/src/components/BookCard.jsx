import { Link } from "react-router-dom";

export default function BookCard({ id, title, author, description, coverImageURL }) {
  return (
    <div className="group relative bg-[#FCFAF7] border border-[#E8E2D9] rounded-sm p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full shadow-[0_4px_12px_rgba(0,0,0,0.05)]">

      {/* Book Cover */}
      <div className="relative mb-6 overflow-hidden rounded-sm shadow-inner bg-[#F3EFE9]">
        <img
          src={coverImageURL}
          alt={title}
          className="w-full h-72 object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
        />
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center text-center">
        <h2 className="text-2xl font-serif italic">{title}</h2>
        <p className="text-xs uppercase tracking-[0.2em] text-[#8C8279] mb-4">by {author}</p>
        <p className="text-sm text-[#6B635C] italic line-clamp-3">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[#F0EDE9] flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

        {/* View Notes */}
        <div className="flex justify-between items-center">
          <button className="text-[10px] uppercase tracking-widest text-[#D4AF37]">
            View Notes
          </button>
          <span className="text-[10px] text-gray-400 italic">
            Book No. {Math.floor(Math.random() * 1000)}
          </span>
        </div>

        {/* Review Button */}
        <div className="flex justify-between items-center">
          <Link
            to={`/review/${id}`}
            className="text-[10px] uppercase tracking-widest text-[#D4AF37] hover:text-[#4A443F] transition-colors"
          >
            Review
          </Link>
          <span className="text-[10px] text-transparent italic">.</span>
        </div>

      </div>
    </div>
  );
}
