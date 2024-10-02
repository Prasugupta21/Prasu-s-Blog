import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ReCAPTCHA } from "react-google-recaptcha"
import { useDispatch } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/slices/userSlice';
import axios from 'axios';
const Login = () => {
  const dispatch=useDispatch();
 
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()
 


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res= await axios.post(
        "/login",
        {
         email,password
        },
        { withCredentials: true }
      );
      const { success, message } = res.data;
    if(!success){
     
        dispatch(signInFailure(message));
        alert('Something Went Wrong');
        console.log('user not found');
      
    }
      if (success) {
    dispatch(signInSuccess(res.data));
        
        
        console.log('login succesful ',res.data);

       
       navigate('/');
      } else {
      dispatch(signInFailure(message))
      }
    } catch (error) {
      console.log(error);
      dispatch(signInFailure(error.message))
    }
    
  };
  return (
    <div>

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
                      Sign in to your account
                  </h1>
                  <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                      
                      <div>
                          <label htmlFor="email" className="block text-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                          <input type="email" onChange={(e)=>setEmail(e.target.value)} autoComplete='off'  value={email}  to name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required=""/>
                      </div>
                      <div>
                          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Password</label>
                          <input type="password" name="password" onChange={(e)=>setPassword(e.target.value)} autoComplete='off' value={password} id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                      </div>
                      <div>
                      < ReCAPTCHA  sitekey={process.env.REACT_APP_SITE_KEY} />

                      </div>

                      
                      <button type="submit" onClick={handleSubmit} className="w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                          Don’t have an account yet? <Link to={'/signup'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign Up</Link>
                      </p>
                  </form>
                  <ToastContainer/>
              </div>
          </div>
      </div>
    </section>
        </div>
  )
}

export default Login