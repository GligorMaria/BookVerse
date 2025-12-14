import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
//import {SignInWithGoogle} from "../Components/SignInWithGoogle.jsx"
import SignInWithGoogle from "../Components/SignInWithGoogle.jsx";

function LogIn()
{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => 
    {
        e.preventDefault()

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          navigate("/")
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }

    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100"> 
        <div className="w-96 p-6 shadow-lg bg-white rounded-md">
                <form className='login-form' onSubmit={handleSubmit}>
                    <h2 className="text-xl block text-center font-semibold">Log In</h2>
                    <div className="mt-3 "><label className="block text-base mb-2">
                        Email:
                        <input 
                        type='email'
                        onChange={(e) => setEmail(e.target.value)}
                        required                                    
                        placeholder="Enter email address"
                        className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border gray-600"></input><br/>
                    </label></div>
                    
                    <label >
                        Password:
                        <input type='password' 
                        onChange={(e) => setPassword(e.target.value)}
                        required                                 
                        placeholder="Enter password"
                        className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border gray-600"></input><br/>
                        
                    </label>
                    <button type='submit' className="mt-3">Log In</button>
                    <SignInWithGoogle/>
                    <p className="mt-3">Don't have an account? <Link to="/signup">SignUp</Link></p>
                </form>
              </div>
          </div>
        );

}

export default LogIn;