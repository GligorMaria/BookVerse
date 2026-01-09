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
       <button className="px-6 py-2 border border-[#D4AF37] text-[10px] uppercase tracking-widest text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-white transition-all duration-500" onClick={handleSignOut}>
            Sign Out
        </button>
    )
}

export default SignOut;