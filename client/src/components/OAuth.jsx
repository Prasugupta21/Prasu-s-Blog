import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { Alert } from "@mui/material";


const OAuth = ({captchaRef}) => {
  const auth = getAuth(app);
  const [error,setError]=useState(null);
  const[showAlert,setShowAlert]=useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    const captchaToken=captchaRef.current.getValue();
    console.log('captcha is ',captchaToken);
    if (!captchaToken) {
    
      setError('Please complete reCAPTCHA');
      setShowAlert(true);
      return;
      

    }
    
    captchaRef.current.reset();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
      const res = await fetch("/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          profilePicture: result.user.photoURL,
          captchaToken
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (e) {
      console.error("Error", e);
    }
  };
  useEffect(() => {
    if(showAlert){
      const timer=setTimeout(()=>{
        setShowAlert(false);
      },2000);
      return ()=> clearTimeout(timer);
    }
  
  }, [showAlert]);
  
  return (
    <>
     
      <button onClick={handleGoogleClick}
        type="button"
        class="group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-gradient-to-br from-pink-500 to-orange-400 enabled:hover:bg-gradient-to-bl focus:ring-pink-200 dark:focus:ring-pink-800 border-0 rounded-lg focus:ring-2"
      >
        <span class="items-center flex justify-center bg-white text-gray-900 transition-all duration-75 ease-in group-enabled:group-hover:bg-opacity-0 group-enabled:group-hover:text-inherit dark:bg-gray-900 dark:text-white w-full rounded-md text-sm px-4 py-2 border border-transparent">
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 1024 1024"
            class="mr-2 w-6 h-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm167 633.6C638.4 735 583 757 516.9 757c-95.7 0-178.5-54.9-218.8-134.9C281.5 589 272 551.6 272 512s9.5-77 26.1-110.1c40.3-80.1 123.1-135 218.8-135 66 0 121.4 24.3 163.9 63.8L610.6 401c-25.4-24.3-57.7-36.6-93.6-36.6-63.8 0-117.8 43.1-137.1 101-4.9 14.7-7.7 30.4-7.7 46.6s2.8 31.9 7.7 46.6c19.3 57.9 73.3 101 137 101 33 0 61-8.7 82.9-23.4 26-17.4 43.2-43.3 48.9-74H516.9v-94.8h230.7c2.9 16.1 4.4 32.8 4.4 50.1 0 74.7-26.7 137.4-73 180.1z"></path>
          </svg>
          Continue with Google
        </span>

      </button>
      { showAlert && error && (
           <Alert variant="filled" severity="error">
           {error}
         </Alert>
          )}
    </>
  );
};

export default OAuth;
