import React from 'react';
import {  signOut } from "firebase/auth";
import {auth} from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

function SignOut() {
    const navigate = useNavigate();

    const handleSignOut = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }

    return(
       <button onClick = {() => {handleSignOut}}>Sign Out</button>
    )
}

export default SignOut;