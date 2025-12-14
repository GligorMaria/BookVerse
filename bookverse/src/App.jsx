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
import {ProtectedRoute} from './Components/Protected.jsx'
import { AuthProvider } from './hooks/useAuth.jsx';

function App(){
  return (
    <Router>
      <AuthProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} /> 
          <Route path="/books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        </Routes>
      </AuthProvider>
    </Router> 
  );
}

export default App;