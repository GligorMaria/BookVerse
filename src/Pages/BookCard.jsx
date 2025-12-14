import React from "react";
import { Link } from "react-router-dom";

export default function BookCard({ id, title, author, coverUrl }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {coverUrl && (
        <img src={coverUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600">by {author}</p>
        <Link
          to={`/books/${id}`}
          className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
