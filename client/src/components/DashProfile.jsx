import React from "react";
import {  Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {  useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Alert from "./Alert";
const DashProfile = () => {
  const { currUser, loading } = useSelector((state) => state.user);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    // eslint-disable-next-line
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

 
  const uploadImage = async () => {
    
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleLogOut = async () => {
    try {
      const data = await axios.post("/logout");

      if (data.status === 200) {
        dispatch(signoutSuccess());
        navigate("/login");
      } else {
        

      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
   
    try {
      dispatch(updateStart());
     
      const res = await fetch(`/update/${currUser?.user?._id}`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          
        },
        credentials:'include',
        body:JSON.stringify(formData)
        
     
      });

      const data=await res.json();
      console.log('updatating profile ',data);

      if (data.success) {
        console.log('updating profile  success',data);

        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
        setImageFileUploadProgress(null);
      } else {
        console.log('updating profile failure')
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);

      }
    } catch (error) {
console.log('Server Error',error);
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const {data,status} = await axios.delete(`/delete/${currUser?.user?._id}`);
      console.log('deleting  user' ,data);
      if (status === 200) {
        console.log('success in deleting ');
        dispatch(deleteUserSuccess(data.user));
        setShowModal(false);
      } else {
        console.log('failure in deleting');
        dispatch(deleteUserFailure(data.message));
      }
    } catch (error) {
      console.log('error in deleting',error);

      dispatch(deleteUserFailure(error));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
           {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 10
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currUser?.user?.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}          />
        </div>
        {imageFileUploadError && (
          <Alert  success={false } message={imageFileUploadError}/>
        )}
        <TextInput
          type="text"
          id="name"
          placeholder="username"
          defaultValue={currUser?.user?.name}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currUser?.user?.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
        
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleLogOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        
         
         <Alert success={true} message={updateUserSuccess} />
        
      )}
      {updateUserError && (
        <Alert success={false} message={updateUserError} />
      )}
      
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
        className='md:w-1/3   mx-auto mt-32 shadow-slate-800   '
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
