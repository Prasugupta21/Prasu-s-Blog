import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import ReCAPTCHA from "react-google-recaptcha";
import  { useRef } from 'react';
import { Label, Spinner, TextInput } from "flowbite-react";
import Alert from '@mui/material/Alert';

import OAuth from "../components/OAuth";
const Login = () => {
  const captchaRef = useRef(null)
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setShowAlert(true);

      return dispatch(signInFailure("Please fill all the fields"));
    }
    const captchaToken = captchaRef.current.getValue();
    if (!captchaToken) {
      setShowAlert(true);
      return dispatch(signInFailure("Please complete the reCAPTCHA"));
    }
  
    captchaRef.current.reset();
    
    try {
      dispatch(signInStart());
      const res = await fetch(
        "/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({...formData,captchaToken}),
        },
        { withCredentials: true }
      );

      const data = await res.json();

      const { success, message } = data;
      if (!success) {
        setShowAlert(true);

        dispatch(signInFailure(message));
        return;
      }
      if (res.ok) {
        console.log(" success in login ", data);

        dispatch(signInSuccess(data));

        navigate("/");
      }
    } catch (error) {
      console.log("Server Error in login");
      setShowAlert(true);

      dispatch(signInFailure(error.message));
    }
  };
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-2xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Prasu's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label
                value="Your email"
                className="dark:text-white text-black"
              />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="flex  text-sm  justify-end mb-[-2rem]">
           
           <Link to="/forgetPassword" className="text-blue-500 hover:underline">
             Forget password ?
           </Link>
         </div>
            <div>
              <Label
                value="Your password"
                className="dark:text-white text-black"
              />
              <TextInput
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <div className="mt-8">
            <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY}  ref={captchaRef}  size="normal" className="group flex p-0.5 "/>

            </div>
            <button
              disabled={loading}
              type="submit"
              class="group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-gradient-to-r from-purple-500 to-pink-500 enabled:hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800 rounded-lg focus:ring-2"
            >
              <span class="flex items-center transition-all duration-200 rounded-md text-sm px-4 py-2">
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </span>
            </button>

            <OAuth captchaRef={captchaRef} />

          {/* {errorMessage ? (
            <>
          <Alert variant="filled" severity="success">
  {errorMessage}
</Alert>
          </>) : ()} */}
          {showAlert && errorMessage && (  <Alert variant="filled" severity="error">
  {errorMessage}
</Alert> )}

          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Not registered?</span>
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Login;
