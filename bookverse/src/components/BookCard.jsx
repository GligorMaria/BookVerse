export default function BookCard({ title, author, description }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">by {author}</p>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
