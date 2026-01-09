import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function AdminDashboard() {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    description: "",
    coverImageURL: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "books"), bookData);
      alert("Book added to the Library of Whispers!");
      setBookData({ title: "", author: "", description: "", coverImageURL: "" });
    } catch (err) {
      console.error("Error adding book: ", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 bg-[#FDFCF8] font-serif">
      <h1 className="text-3xl italic mb-8">Add a New Volume</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          className="border p-2" 
          placeholder="Title" 
          onChange={(e) => setBookData({...bookData, title: e.target.value})} 
        />
        <input 
          className="border p-2" 
          placeholder="Author" 
          onChange={(e) => setBookData({...bookData, author: e.target.value})} 
        />
        <textarea 
          className="border p-2 h-32" 
          placeholder="Description" 
          onChange={(e) => setBookData({...bookData, description: e.target.value})} 
        />
        <input 
          className="border p-2" 
          placeholder="Cover Image URL" 
          onChange={(e) => setBookData({...bookData, coverImageURL: e.target.value})} 
        />
        <button className="bg-[#4A443F] text-white py-2 uppercase tracking-widest">
          Publish to Shelves
        </button>
      </form>
    </div>
  );
}

export default AdminDashboard;