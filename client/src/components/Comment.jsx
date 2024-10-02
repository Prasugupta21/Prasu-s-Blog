import React from 'react'
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import {  Textarea } from 'flowbite-react'
import axios from 'axios';

const Comment = ({comment,onEdit,onLike,onDelete}) => {
const [user,setUser]=useState({});
const [isEditing, setIsEditing]=useState(false);
const [editedContent,setEditedContent]=useState(comment.content);
const {currUser}=useSelector(state=>state.user);

useEffect(() => {
const getUser=async()=>{
    try {
        const res=await fetch(`/${comment.userId}`);
        const data=await res.json();
        if(res.ok){
     setUser(data.user);
        }
    } catch (e) {
        console.error('Server Error in getting user', e)
    }
    
   
}
   getUser(); 
}, [comment]);


const handleEdit=()=>{
    setEditedContent(comment.content);
    setIsEditing(true);
    
}
const handleSave=async () => {
    try {
        const {status}=await axios.put(`/comments/editcomment/${comment._id}`);
        if(status===201){
            setIsEditing(false);
            onEdit(comment,editedContent);
        }

    } catch (e) {
        console.error('Server Error in editing content', e)
    }
    
  }
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
    <div className='flex-shrink-0 mr-3'>
      <img
        className='w-10 h-10 rounded-full bg-gray-200'
        src={user.profilePicture}
        alt={user.name}
      />
    </div>
    <div className='flex-1'>
      <div className='flex items-center mb-1'>
        <span className='font-bold mr-1 text-xs truncate'>
          {user ? `@${user.name}` : 'anonymous user'}
        </span>
        <span className='text-gray-500 text-xs'>
          {moment(comment.createdAt).fromNow()}
        </span>
      </div>
      {isEditing ? (
        <>
          <Textarea
            className='mb-2'
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className='flex justify-end gap-2 text-xs'>
           
           
            <button  onClick={handleSave} type="button" className="group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-gradient-to-br from-purple-600 to-cyan-500 enabled:hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800 rounded-lg focus:ring-2"><span class="flex items-center transition-all duration-200 rounded-md text-sm px-3 py-1.5">Save</span></button>
           
            <button onClick={() => setIsEditing(false)} type="button" class="group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-gradient-to-br from-purple-600 to-cyan-500 enabled:hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800 border-0 rounded-lg focus:ring-2"><span class="items-center flex justify-center bg-white text-gray-900 transition-all duration-75 ease-in group-enabled:group-hover:bg-opacity-0 group-enabled:group-hover:text-inherit dark:bg-gray-900 dark:text-white w-full rounded-md text-sm px-3 py-1.5 border border-transparent">Cancel</span></button>
          </div>
        </>
      ) : (
        <>
          <p className='text-gray-500 pb-2'>{comment.content}</p>
          <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
            <button
              type='button'
              onClick={() => onLike(comment._id)}
              className={`text-gray-400 hover:text-blue-500 ${
                currUser?.user &&
                comment.likes.includes(currUser?.user._id) &&
                '!text-blue-500'
              }`}
            >
              <FaThumbsUp className='text-sm' />
            </button>
            <p className='text-gray-400'>
              {comment.numberOfLikes > 0 &&
                comment.numberOfLikes +
                  ' ' +
                  (comment.numberOfLikes === 1 ? 'like' : 'likes')}
            </p>
            {currUser?.user &&
              (currUser?.user?._id === comment.userId || currUser?.user?.isAdmin) && (
                <>
                  <button
                    type='button'
                    onClick={handleEdit}
                    className='text-gray-400 hover:text-blue-500'
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => onDelete(comment._id)}
                    className='text-gray-400 hover:text-red-500'
                  >
                    Delete
                  </button>
                </>
              )}
          </div>
        </>
      )}
    </div>
  </div>  )
}

export default Comment