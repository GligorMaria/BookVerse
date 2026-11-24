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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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