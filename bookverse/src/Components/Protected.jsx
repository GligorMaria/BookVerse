import {Navigate} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading protected content...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};