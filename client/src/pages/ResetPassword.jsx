import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Label, Spinner, TextInput } from 'flowbite-react';
import { Alert } from '@mui/material';
import { resetPasswordStart,resetPasswordSuccess,resetPasswordFailure } from '../redux/user/userSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from "react-google-recaptcha";
import  { useRef } from 'react';
const ResetPassword = () => {
  const [password,setPassword]=useState('');
  const captchaRef = useRef(null)
const [confirmPassword,setconfirmPassword]=useState('');
  const [message,setMessage]=useState('');
  const navigate=useNavigate();
  const [isSuccess,setIsSuccess]=useState(false);
  const [isFailure,setIsFailure]=useState(false);
  const [passwordMatch,setPasswordMatch]=useState(true);
const dispatch=useDispatch();
const {token}=useParams();
const {error,loading}=useSelector((state)=>state.user)
  useEffect(() => {
    if(isSuccess || isFailure){
      const timer=setTimeout(()=>{
        if(isSuccess)setIsSuccess(false);
        else if(isFailure)setIsFailure(false);

      },2000)
      return ()=>clearTimeout(timer);
    }

  }, [isSuccess,isFailure]);
  
  useEffect(() => {
    // Check if passwords match whenever either password field changes
    setPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);
  const handleSubmit=async(e)=> {
 e.preventDefault();
 const captchaToken = captchaRef.current.getValue();
  if (!captchaToken) {
    setIsFailure(true);
 dispatch(resetPasswordFailure("Please complete the reCAPTCHA"));
 return;
  }
  captchaRef.current.reset();
 if (!passwordMatch) {
    setIsFailure(true);
    dispatch(resetPasswordFailure('Passwords do not match'));
    return;
  }
  
 
    try {
      dispatch(resetPasswordStart());
    
      const res=await axios.post(`/reset-password/${token}`,{password,confirmPassword});
    
      if(res.status===200){
        setIsSuccess(true);
        setMessage('Password reset successful');
       dispatch(resetPasswordSuccess());
      setTimeout(()=> navigate('/login'),2000);
      }
      else{
        setIsFailure(true);
        dispatch(resetPasswordFailure('Something went wrong'));
      }
    } catch (e) {
      dispatch(resetPasswordFailure('Something went wrong'));
      setIsFailure(true);

      console.error('Error', e)
    }
    
  }
  return (
    <div>
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
                value="New Password"
                className="dark:text-white text-black"
              />
              <TextInput
                type="password"
                placeholder="password"
                id="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            
            <div>
              <Label
                value="Confirm Password"
                className="dark:text-white text-black"
              />
              <TextInput
                type="password"
                placeholder="password"
              id="confirmPassword"
                value={confirmPassword}
                onChange={(e)=>setconfirmPassword(e.target.value)}
              />
            </div>
            {!passwordMatch && confirmPassword!=='' && confirmPassword && confirmPassword.length >= password.length && (
                <Alert variant="filled" severity="warning">
                Passwords do not match
              </Alert>
            )}

<div className="mt-2">
            <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY}  ref={captchaRef}  size="normal" className="group flex p-0.5 "/>

            </div>
            <button
              disabled={loading  || !passwordMatch}
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
                  "Submit"
                )}
              </span>
            </button>



          

            {isSuccess  && (  <Alert variant="filled" severity="success">
  {message}
</Alert> )}
            {isFailure && (  <Alert variant="filled" severity="error">
  {error}
</Alert> )}

          </form>
         
        </div>
      </div>
    </div>
    </div>
  )
}

export default ResetPassword