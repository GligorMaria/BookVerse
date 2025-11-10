import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'

export default function BookList() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'books'), (snapshot) => {
      const bookData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setBooks(bookData)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Book List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={book.coverImageURL} alt={book.title} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
              <p className="mt-2 text-yellow-500">⭐ {book.averageRating || 'No rating yet'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
