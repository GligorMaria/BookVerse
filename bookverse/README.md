# BookVerse app

React 19 + Vite single-page app on Firebase (Auth, Firestore, Storage), with an Android build through Capacitor.

## Web

```bash
npm install
npm run dev
```

Vite prints the local address (port 3000 by default).

## Android

Needs Android Studio with the Android SDK.

```bash
npm run cap:sync   # build the web app and copy it into android/
npm run android    # same, then open the project in Android Studio
```

Then press **Run** in Android Studio, on an emulator or a phone with USB debugging on. The debug APK ends up in `android/app/build/outputs/apk/debug/app-debug.apk`.

Run `npm run cap:sync` again after every change in `src/`.

### Google sign-in on Android

`signInWithPopup` does not work inside the app's WebView, so on Android `src/firebase/firebase.js` uses native Google Sign-In through `@capacitor-firebase/authentication` and hands the token to the Firebase JS SDK. On the web it still uses the popup.

For native sign-in to work:

1. In the Firebase console, add an Android app with package name `com.bookverse.app`.
2. Add the SHA-1 of your signing key (Android Studio: Gradle → `app` → Tasks → android → `signingReport`).
3. Download `google-services.json` into `android/app/`. It is git-ignored.

Email/password sign-in works without this step.

### Notes

- The Gradle wrapper is on 9.2.1 so it runs on the Java 25 bundled with recent Android Studio.
- On small screens the navbar collapses into a menu button (`src/Components/Navbar.jsx`).
