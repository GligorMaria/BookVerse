import googleLogo from "../google.png";
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import {auth} from "../firebase/firebase"
import {useNavigate } from 'react-router-dom';


function SignInWithGoogle()
{
    const navigate = useNavigate();
     const googleLogin = () => {
    const provider = new GoogleAuthProvider();

    signInWithRedirect(auth, provider)
      .then((result) => {
        console.log(result);
        navigate("/");
      })
      .catch((error) => {
        console.error(error.code, error.message);
      });
  };

    return(
        <div className="mt-4">
            <p className="text-center">--Or continue with--</p>
            <div className="justify-center"onClick={googleLogin}>
                <img src={googleLogo}
                alt="Google logo"
                width="60%"
                className="mx-auto"></img>
            </div>
        </div>
    );
}

export default SignInWithGoogle;