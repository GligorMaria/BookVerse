import { books } from "./books";

function App() {
  return (
    <div className="App">
      <h1>BookVerse 📚</h1>
      <div>
        {books.map(book => (
          <div key={book.id}>
            <h2>{book.title}</h2>
            <p>by {book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
