import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG3B3HdjaVGTJiDkj9XbieRMa81JcoBoA",
  authDomain: "bookverse-d7e78.firebaseapp.com",
  projectId: "bookverse-d7e78",
  storageBucket: "bookverse-d7e78.firebasestorage.app",
  messagingSenderId: "334516603573",
  appId: "1:334516603573:web:2b2aacaf2783baa7fd4cfc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export {app,auth};