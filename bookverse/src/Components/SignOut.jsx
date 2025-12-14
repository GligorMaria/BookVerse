import React from 'react';
import {  signOut } from "firebase/auth";
import {auth} from '../firebase/firebase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function SignOut() {
    const { logout } = useAuth();

    const handleSignOut = async () => {
        try{
            await signOut(auth);
            logout(); 
            console.log("Signed out successfully");
        }               
        catch (error) {// An error happened.
            console.error("Sign out error:", error); // Use console.error for errors
        }
    };

    return(
       <button onClick={handleSignOut}>
            Sign Out
        </button>
    )
}

export default SignOut;