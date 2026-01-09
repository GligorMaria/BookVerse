import SignInWithGoogle from "../Components/SignInWithGoogle.jsx";
import React, { useState } from 'react';
import { auth } from '../firebase/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard'); 
        } catch (error) {
            console.error("Login failed:", error.message);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (

        <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFCF8] p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-[#4A443F]">Welcome Back</h2>
                <p className="text-[#8C8279] text-sm">Please enter your details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-[#4A443F] mb-1">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#4A443F] mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs font-semibold"
                        >
                            {showPassword ? "HIDE" : "SHOW"}
                        </button>
                    </div>
                </div>

                <button 
                        type="submit"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4A443F'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
                        style={{ backgroundColor: '#D4AF37' }}
                        className="w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out active:scale-[0.97]"
                    >
                        Sign In
                    </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>

            <SignInWithGoogle />

            <p className="mt-6 text-center text-sm text-gray-600">
                New here? <Link to="/signup" className="text-amber-600 font-bold hover:underline">Create account</Link>
            </p>
        </div>
        </div>
    );
}

export default LogIn;