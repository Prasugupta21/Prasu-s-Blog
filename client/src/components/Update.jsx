import React from 'react'
import { Alert } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserFailure,
    deleteUserSuccess,
    deleteUserStart,
    signoutSuccess


} from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
const Update = () => {
const { currUser, error,loading } = useSelector((state) => state.user);

const navigate =useNavigate();
const [imageFile, setImageFile] = useState(null);
const [imageFileUploadError, setImageFileUploadError] = useState(false);
const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
const [updateUserError, setUpdateUserError] = useState(null);
const [formData, setFormData] = useState({});

const filePickerRef = useRef();
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  useEffect(()=>{
    if(!currUser)navigate('/login');
  },[currUser])
  const uploadImage = async () => {

    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       
        
      },
      (error) => {
        setImageFileUploadError(
          error
        );
     
        
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
         
        });
      }
    );
  };


  const handleLogOut=async()=>{
    try {
     const data= await axios.post('/logout');
   if(data.status===200){
     console.log("logout completed ",data);
   dispatch(signoutSuccess());
   navigate('/login');
   
   }
   else{
     console.log('not success ')
   }
    } catch (error) {
     console.log(error);
    }
   
   
     }
   
  const handleSubmit = async (e) => {
    e.preventDefault();
  
 
    try {
      dispatch(updateStart());
   
      const res = await fetch(`/update/${currUser.user._id}`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify(formData),
      });
    
      const data=await res.json();
    console.log("consoling  ",data);
      if (data.success) {
        console.log("calling from update success ",data);
        dispatch(updateSuccess(data));
        console.log('updated successfully ', data);
        setUpdateUserSuccess("User's profile updated successfully");
       toast.success('Profile Updated Successfully');
      } else {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
        console.log("calling from update not success ");
      
      }
    } catch (error) {
      console.log("calling from update error");

      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);

    }
  };

const handleDeleteUser=async()=>{
  try {
    dispatch(deleteUserStart());
    const data=await axios.delete(`/delete/${currUser?.user?._id}`);
    console.log(data);
    if(data.status===200){
      dispatch(deleteUserSuccess(data.user));
      toast.success('User Deleted Successfully');
      console.log('User Deleted Successfully');
    }
    else{
      dispatch(deleteUserFailure(data.message));
      console.log('Not Success in User Deletion ');

    }
    
  } catch (error) {
    dispatch(deleteUserFailure(error));
      console.log('Error in User Deletion ');
  }
}

  return (
   <>
   <Header/>
   <section className=" dark:bg-gray-900 mx-auto">
 
         
    <div className="p-3 max-w-lg mx-auto">
             <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
  
    <input type="file"  
          ref={filePickerRef}
          hidden
          accept='image/*'
          onChange={handleImageChange}
           />

           


        
            <img
            src={formData.profilePicture || currUser?.user?.profilePicture} 
            alt='user'   onClick={() => filePickerRef.current.click()}
            className='rounded-full relative w-32 h-32 cursor-pointer  object-cover self-center' 
          />
        


   

        
          
          <div className="p-6 text-center space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold  leading-tight tracking-tight text-white md:text-2xl dark:text-white">
                  Update Profile
              </h1>
          
                  <div className='mx-auto'>
                      <label htmlFor="name" className="block  text-left md:ml-5 ml-3 mb-2 text-sm font-medium text-white dark:text-white ">Name</label>
                      <input  onChange={handleChange} autoComplete='off' type="text" name="name" id="name" defaultValue={currUser?.user?.name}  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-[18rem] mx-auto md:w-[24rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" required=""/>
                  </div>
                  <div>
                      <label htmlFor="email" className="block text-left md:ml-5 mb-2 ml-3 text-sm font-medium text-white dark:text-white">Email</label>
                      <input type="email" onChange={handleChange} autoComplete='off'  name="email" id="email"  defaultValue={currUser?.user?.email}  className="bg-gray-50 border  border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-[18rem] mx-auto   md:w-[24rem] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required=""/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 sm:ml-5 text-sm ml-3 font-medium text-white dark:text-white text-left">Password</label>
                      <input type="password" name="password" onChange={handleChange} autoComplete='off'  id="password"  placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-[18rem] mx-auto  p-2.5  md:w-[24rem] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  </div>
                  
                  <button   disabled={loading} type="submit" className="w-full mt-4  bg-gradient-to-r from-[pink] to-yellow-500 hover:bg-red-700 text-black bg-primary-600 hover:bg-primary-700 ] focus:outline-none  font-medium rounded-lg text-sm px-3 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 ">{loading ? 'Loading...' :'Update'}</button>
           
           
          </div>
       <div className='sm:mt-[-3rem] mx-auto mt-[-2rem]'>
       {updateUserError && (
        <Alert color='failure' className=' text-red-600'>
          {updateUserError}
        </Alert>
      )}
      {updateUserSuccess && (
        <Alert color='success' className=' mx-auto text-green-600'>
          {updateUserSuccess}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className=' text-red-600'>
          {error}
        </Alert>
      )}
       </div>
      
 
          </form>

          <div className="flex justify-between mt-2 mb-12 ">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleLogOut} className="text-red-700 cursor-pointer">
          Log out
        </span>
      </div>


   

    </div>
</section>
</>
   
  )
}

export default Update