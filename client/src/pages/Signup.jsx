import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {  Button, Label, Spinner, TextInput } from 'flowbite-react';
import OAuth from '../components/OAuth';
import { Alert } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";

const Signup = () => {
  const captchaRef=useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value});
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {setShowAlert(true);return setErrorMessage('Please fill out all fields.');}
    const captchaToken = captchaRef.current.getValue();
    console.log('captcha is ',captchaToken);
    if (!captchaToken) {
      setShowAlert(true);
      setErrorMessage('Please complete reCAPTCHA');
    return;

      
    }
  
    captchaRef.current.reset();
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData,captchaToken}),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setLoading(false);
         setErrorMessage(errorData.message || 'An error occurred');
         setShowAlert(true);

         return;
      }
      const data = await res.json();
      const { success, message } = data;
      
      if (success===false) {
        console.log("success false ");
         setErrorMessage(message || 'An error occurred');
         setShowAlert(true);

        
      } 
       
        setLoading(false);
        
       if(res.ok){
        console.log('success in signup');
        navigate('/login');
       }
    } catch (error) {
      console.log('Server Error',error);
      setLoading(false);
    setErrorMessage(error.message || 'An error occurred')
    setShowAlert(true);

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
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-2xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1 relative mb-8'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Prasu's Blog
            </span>
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign up with your email and password or with Google.
          </p>
        </div>
        {/* right */}
        <div className='flex-1'>
          <form autoComplete='off' className='flex flex-col gap-4 mt-[-1rem]' onSubmit={handleSubmit}>
            <div>
              <Label value='Your Name' className='dark:text-white text-black' />
              <TextInput
                type='text'
                placeholder='Name'
                id='name'
                name='new-name'
                autoComplete='off'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your Email' className='dark:text-white text-black' />
              <TextInput
                type='email'
              placeholder='name@company.com'
                id='email'
                name='new-email'
                autoComplete='off'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' className='dark:text-white text-black' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                name='new-password'
                autoComplete='new-password'
                onChange={handleChange}
              />
            </div>
            <div className="">
            <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY}  ref={captchaRef}  size="normal" className="group flex p-0.5 "/>

            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth captchaRef={captchaRef}  />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Already have an account?</span>
            <Link to='/login' className='text-blue-500'>
              Sign In
            </Link>
          </div>
          {showAlert && errorMessage && (
             <Alert variant="filled" severity="error">
             {errorMessage}
           </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
