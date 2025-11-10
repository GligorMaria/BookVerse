import { books } from '../books';

function Browse() {
  return(
    <>
        <h1>Browse</h1>
        <div>
            {books.map(book => (
                <div key={book.id}>
                <h2>{book.title}</h2>
                <p>by {book.author}</p>
                </div>
            ))}
        </div>
    </>
  );
}

export default Browse