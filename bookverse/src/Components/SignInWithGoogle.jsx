import googleLogo from "../google.png";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {auth} from "../firebase/firebase"


function SignInWithGoogle()
{
     const signInWithGoogle = async () => {

        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error initiating Google sign-in:", error.message);
        }
    };

    return(
        <button
          type="button"
          onClick={signInWithGoogle}
          className="mt-3 w-full"
        >
          <img
            src={googleLogo}
            alt="Sign in with Google"
            className="mx-auto h-10 cursor-pointer"
          />
        </button>
    );
}

export default SignInWithGoogle;