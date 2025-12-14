import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components & Pages
import Navbar from "./Components/Navbar.jsx";
import Home from "./Pages/Home.jsx";
import Browse from "./Pages/Browse.jsx";
import MyBooks from "./Pages/MyBooks.jsx";
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Profile from "./Pages/Profile.jsx";
import BookDetails from "./Pages/BookDetails.jsx"; // Use Case 4

// Context & Protected Route
import { AuthContext } from "./Context/AuthContext.jsx";
import { Protected } from "./Components/Protected.jsx";

function App() {
  return (
    <AuthContext>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/books" element={<Protected><MyBooks /></Protected>} />
          <Route path="/books/:id" element={<Protected><BookDetails /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
        </Routes>
      </Router>
    </AuthContext>
  );
}

export default App;
