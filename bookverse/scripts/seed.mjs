// Seeds Firestore with sample books, reviews and reader profiles.
// Usage: npm run seed   (reads the Firebase config from .env)
//
// Uses fixed document ids, so running it again updates the same documents
// instead of creating duplicates. The sample readers are Firestore profiles
// only; they have no Firebase Auth account and cannot sign in.

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, terminate } from "firebase/firestore";

const env = process.env;
const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const cover = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
const avatar = (seed) => `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}`;

const users = {
  "seed-reader-ana": {
    email: "ana.popescu@example.com",
    role: "user",
    displayName: "Ana Popescu",
    photoURL: avatar("Ana"),
    bio: "Reading my way through the classics, one rainy afternoon at a time.",
    favoriteGenre: "Classic Romance",
    friends: ["seed-reader-mihai"],
    pendingRequests: [],
  },
  "seed-reader-mihai": {
    email: "mihai.ionescu@example.com",
    role: "user",
    displayName: "Mihai Ionescu",
    photoURL: avatar("Mihai"),
    bio: "Maps, dragons and long journeys. The thicker the book, the better.",
    favoriteGenre: "Fantasy",
    friends: ["seed-reader-ana"],
    pendingRequests: [
      { uid: "seed-reader-elena", displayName: "Elena Marin", photoURL: avatar("Elena") },
    ],
  },
  "seed-reader-elena": {
    email: "elena.marin@example.com",
    role: "admin",
    displayName: "Elena Marin",
    photoURL: avatar("Elena"),
    bio: "Librarian by day, dystopia collector by night.",
    favoriteGenre: "Dystopian Fiction",
    friends: [],
    pendingRequests: [],
  },
};

const books = {
  "seed-pride-and-prejudice": {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverImageURL: cover("9780141439518"),
    description:
      "Elizabeth Bennet and the proud Mr. Darcy misjudge each other at every turn in this sharp, witty novel about manners, money and marriage in Regency England.",
    reviews: [
      { rating: 5, text: "Witty from the first line to the last. Elizabeth is unforgettable." },
      { rating: 4, text: "Slow start, but the second half is impossible to put down." },
    ],
  },
  "seed-the-hobbit": {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    coverImageURL: cover("9780547928227"),
    description:
      "Bilbo Baggins is swept out of his comfortable hole by a wizard and thirteen dwarves, on a quest to reclaim a treasure guarded by the dragon Smaug.",
    reviews: [
      { rating: 5, text: "The perfect adventure. Riddles in the dark is still my favourite chapter." },
      { rating: 5, text: "Read it as a child and again now; it only gets better." },
      { rating: 4, text: "Charming and fast, lighter than The Lord of the Rings." },
    ],
  },
  "seed-1984": {
    title: "1984",
    author: "George Orwell",
    coverImageURL: cover("9780451524935"),
    description:
      "Winston Smith works rewriting history for a regime that watches everything. A chilling story of surveillance, truth and the limits of rebellion.",
    reviews: [
      { rating: 5, text: "Terrifying because so much of it still feels relevant." },
      { rating: 3, text: "Important, but bleak. Not one to read on a bad day." },
    ],
  },
};

const now = new Date();

for (const [id, data] of Object.entries(users)) {
  await setDoc(doc(db, "users", id), { ...data, createdAt: now });
  console.log(`user    ${data.displayName}`);
}

for (const [id, { reviews, ...data }] of Object.entries(books)) {
  await setDoc(doc(db, "books", id), { ...data, createdAt: now });
  console.log(`book    ${data.title}`);
  for (const [i, review] of reviews.entries()) {
    await setDoc(doc(db, "books", id, "reviews", `seed-review-${i + 1}`), {
      ...review,
      hidden: false,
      createdAt: now,
    });
  }
  console.log(`        + ${reviews.length} reviews`);
}

await terminate(db);
console.log("Done.");
