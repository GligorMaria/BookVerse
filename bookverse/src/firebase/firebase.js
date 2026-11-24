import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


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
const isNative = Capacitor.isNativePlatform();
// In the Android WebView, getAuth() can hang; use IndexedDB persistence there.
const auth = isNative
  ? initializeAuth(app, { persistence: indexedDBLocalPersistence })
  : getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Web: popup. Android: native Google Sign-In, then hand the token to the JS SDK
// (signInWithPopup does not work inside the app's WebView).
export async function signInWithGoogle() {
  if (!isNative) {
    return signInWithPopup(auth, new GoogleAuthProvider());
  }
  const result = await FirebaseAuthentication.signInWithGoogle();
  const credential = GoogleAuthProvider.credential(result.credential?.idToken);
  return signInWithCredential(auth, credential);
}

export async function logOut() {
  if (isNative) {
    await FirebaseAuthentication.signOut();
  }
  await signOut(auth);
}

export {app,auth};