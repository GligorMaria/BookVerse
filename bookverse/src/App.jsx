import { useEffect, useState } from "react";
import { auth, db, storage, signInWithGoogle, logOut } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, getDoc, addDoc, doc, setDoc, query, where, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function App() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);

  // Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Save user info on first login
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            name: currentUser.displayName || currentUser.email,
            email: currentUser.email,
            createdAt: new Date()
          });
        }
        fetchBooks(currentUser);
      } else {
        setUser(null);
        setBooks([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch books
  const fetchBooks = async (currentUser = user) => {
    if (!currentUser) return;
    // Only this user's books (the security rules reject any other query).
    const booksQuery = query(collection(db, "books"), where("userId", "==", currentUser.uid));
    const snapshot = await getDocs(booksQuery);
    const booksList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBooks(booksList);
  };

  // Add book
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!user || !title.trim() || !author.trim()) return;

    let coverUrl = "";
    if (file) {
      // Unique path per user, so covers with the same file name don't overwrite each other.
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storageRef = ref(storage, `covers/${user.uid}/${Date.now()}-${safeName}`);
      await uploadBytes(storageRef, file);
      coverUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "books"), {
      userId: user.uid,
      title: title.trim(),
      author: author.trim(),
      coverUrl,
      createdAt: serverTimestamp()
    });
    setTitle("");
    setAuthor("");
    setFile(null);
    fetchBooks();
  };

  // Sign in Google
  const handleGoogleLogin = async () => {
    try { await signInWithGoogle(); } catch (err) { console.error(err); }
  };

  // Sign out
  const handleLogout = async () => { await logOut(); };

  // Search filter
  const term = searchTerm.toLowerCase();
  const filteredBooks = books.filter(b =>
    (b.title || "").toLowerCase().includes(term) ||
    (b.author || "").toLowerCase().includes(term)
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>BookVerse 📚</h1>

      {!user ? (
        <div>
          <button onClick={handleGoogleLogin} style={{ padding: "10px", marginRight: "10px" }}>Sign in with Google</button>
          {/* Add email login/sign-up buttons if needed */}
        </div>
      ) : (
        <div>
          <p>Welcome, {user.displayName || user.email}</p>
          <button onClick={handleLogout} style={{ padding: "10px" }}>Sign Out</button>

          {/* Add book form */}
          <form onSubmit={handleAddBook} style={{ marginTop: "20px", marginBottom: "20px" }}>
            <input placeholder="Book Title" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: "8px", marginRight: "10px" }} />
            <input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} style={{ padding: "8px", marginRight: "10px" }} />
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} style={{ marginRight: "10px" }} />
            <button type="submit" style={{ padding: "8px" }}>Add Book</button>
          </form>

          {/* Search */}
          <input
            placeholder="Search books..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: "8px", marginBottom: "20px", width: "300px" }}
          />

          {/* Book list */}
          <div>
            {filteredBooks.map(book => (
              <div key={book.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                <h2>{book.title}</h2>
                <p>by {book.author}</p>
                {book.coverUrl && <img src={book.coverUrl} alt={book.title} style={{ width: "100px", height: "auto" }} />}
              </div>
            ))}
            {filteredBooks.length === 0 && <p>No books found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
