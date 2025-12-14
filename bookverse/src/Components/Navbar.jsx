import {  Link } from 'react-router-dom';
import { Protected } from './Protected.jsx';
import SignOut from './SignOut.jsx';
const styles =
{
  link:"text-white hover:bg-white hover:text-black px-3 py-1 rounded transition-colors"
}

function Navbar(){

    return (
      <div className="bg-zinc-900 p-3 flex justify-between items-center">
          <h2 className=" text-3xl font-bold text-white">BookVerse 📚</h2>
          <nav className="md:flex space-x-6">
              <Link to="/" className={styles.link}>Home</Link>
              <Link to="/browse" className={styles.link}>Browse</Link>
              <Link to="/books" className={styles.link}>My Books</Link> 
              <Link to="/profile" className={styles.link}>Profile</Link>
              <Link to="/login" className={styles.link}>Login</Link>
              
          </nav>
      </div>
    );
}
//<Protected className={styles.link}><button onClick={() => signOut(auth)}>Logout</button></Protected>
export default Navbar;