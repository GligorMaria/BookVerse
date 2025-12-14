import { BrowserRouter as Router , Routes, Route} from 'react-router-dom';
// Ensure all these components and pages are correctly imported
import Navbar from './Components/Navbar.jsx'; 
import Home from './Pages/Home.jsx'
import Browse from './Pages/Browse.jsx'; // This is the component with the Firebase logic
import MyBooks from './Pages/MyBooks.jsx';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';
import Profile from './Pages/Profile.jsx'
import {AuthContext} from './Context/AuthContext.jsx';
import {Protected} from './Components/Protected.jsx'

function App(){
  return (
    <AuthContext>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} /> 
          <Route path="/books" element={<Protected><MyBooks /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Protected><Profile/></Protected>}/>
        </Routes>
      </Router>
    </AuthContext>
  );
}

export default App;