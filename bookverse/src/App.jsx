import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar.jsx'; 
import Home from './Pages/Home.jsx';
import Browse from './Pages/Browse.jsx';
import MyBooks from './Pages/MyBooks.jsx';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';
import Profile from './Pages/Profile.jsx';

import { ProtectedRoute } from './Components/Protected.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';

import Review from "./Pages/Review";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/review/:id" element={<Review />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
