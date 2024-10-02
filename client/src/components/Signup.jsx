import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import  { useRef } from 'react';
const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password,setPassword]=useState();
  const [name,setName]=useState();
  const captchaRef=useRef(null);

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const captchaToken = captchaRef.current.getValue();
    if (!captchaToken) {
      return dispatch(signInFailure("Please complete the reCAPTCHA"));
    }
  
    captchaRef.current.reset();
    try {
      const { data } = await axios.post(
        "/signup",
        { email, password, name,captchaToken },
        { withCredentials: true }
        
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
      console.log('registration success')
        navigate('/login');
      } else {
        handleError(message);
        console.log(message);
      }
    } catch (error) {
      console.log(error);
    }
    
  };
  return (

<>
<section className="bg-gradient-to-r from-[#090909] to-[#420842] dark:bg-gray-900">
  <div className="flex flex-col items-center text-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
  <img
            src="../../images/user.png" // Replace with your logo URL
            alt="User Logo"
            className="h-16 w-16 rounded-full my-4 object-cover"
          />

      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign Up
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                      <label htmlFor="name" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input  onChange={(e)=>setName(e.target.value)} autoComplete='off' type="text" name="name" id="name" value={name} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" required=""/>
                  </div>
                  <div>
                      <label htmlFor="email" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                      <input type="email" onChange={(e)=>setEmail(e.target.value)} autoComplete='off'  name="email" id="email"  value={email} className="bg-gray-50 border  border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required=""/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Password</label>
                      <input type="password" name="password" onChange={(e)=>setPassword(e.target.value)} autoComplete='off'  id="password"  value={password} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  </div>
               

                  <button type="submit" className="w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign Up</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                  </p>
              </form>
              <ToastContainer/>
          </div>
      </div>
  </div>
</section>
    </>
  )
}

export default Signup