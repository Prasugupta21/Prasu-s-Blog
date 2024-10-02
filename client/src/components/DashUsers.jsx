"use client";

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

const DashUsers = () => {
  const { currUser } = useSelector(state => state.user);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState('');
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, status } = await axios.get('/getusers');
        console.log('fetching user ',data);

        if (status === 200) {

          setUsers(data.users);
          console.log('fetching user success ',data);


         
          if (data?.users?.length < 9) setShowMore(false);
        } else {
        }
      } catch (error) {
        console.log("server error ", error);
      }
    };
    if (currUser?.user?.isAdmin) fetchUsers();
    // eslint-disable-next-line
  }, [currUser?.user?._id]);
  useEffect(() => {
  }, [users]);
  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const { data } = await axios.get(`/getusers?startIndex=${startIndex}`);

      if (data?.success) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) setShowMore(false);
      } else {
        console.log('failure in fetching users');
      }
    } catch (e) {
      console.error('Server Error', e);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const {  status } = await axios.delete(`/delete/${id}`);
      console.log('deleting user ');

      if (status === 200) {
        console.log('deleting user success ');

        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.filter(user => user._id !== id);
      
          return updatedUsers;
        });  
       
        setShowModal(false);
      } else {
        console.log('failure in deleting users');
      }
    } catch (e) {
      console.error('Server Error', e);
    }
  };

  return (
    <div className='overflow-x-auto text-white md:mx-auto p-3 mt-16'>
      {currUser?.user?.isAdmin && users?.length > 0 ? (
        <>
        <h1 className='mx-auto flex justify-center m-4 text-2xl'>All Users</h1>
          <table className='min-w-full bg-black dark:bg-gray-800 shadow-md'>
            <thead className='bg-black dark:bg-gray-700'>
              <tr>
                <th className='px-4 py-2 text-left'>Date Created</th>
                <th className='px-4 py-2 text-left'>User Image</th>
                <th className='px-4 py-2 text-left'>Username</th>
                <th className='px-4 py-2 text-left'>Email</th>
                <th className='px-4 py-2 text-left'>Admin</th>
                <th className='px-4 py-2 text-left'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className='bg-black dark:bg-gray-800'>
                  <td className='border px-4 py-2'>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className='border px-4 py-2'>
                    <img
                      src={user?.profilePicture}
                      alt={user?.name}
                      className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                    />
                  </td>
                  <td className='border px-4 py-2'>{user?.name}</td>
                  <td className='border px-4 py-2'>{user?.email}</td>
                  <td className='border px-4 py-2'>
                    {user.isAdmin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}
                  </td>
                  <td className='border px-4 py-2'>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setId(user._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className='text-center'>You have no users yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
        className='md:w-1/3   mx-auto mt-32 '
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button  className='bg-red-700' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button className="bg-gray-600" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashUsers;
