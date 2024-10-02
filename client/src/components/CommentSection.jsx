"use client"

import {   Button, Modal, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';
import Alert from './Alert';



const CommentSection = ({postId}) => {
    const {currUser}=useSelector(state=>state.user);
    const [comment,setComment]=useState('');
    const [comments,setComments]=useState([]);
    const [commentError,setCommentError]=useState('');
    const [showModal,setShowModal]=useState(false);
    const [id,setId]=useState('');
    const navigate=useNavigate();
    const handleSubmit=async (e) => { 
        e.preventDefault();
        if(comment.length>200)return;
        try {
            const {data,status}=await axios.post('/comments/createcomment',{
              
              
              content:comment,
                postId,
                userId:currUser?.user?._id,
             
               
               
            });
         
        console.log('comment creation ',data);
            if(status===201){
                setComment('');
            setCommentError(null);
            console.log('comment creation success ',data);

        
                setComments([data?.newComment,...comments]);
            }
            else{
              console.log('comment creation failure ');
            }
        } catch (e) {
            console.error('Error in comment creation', e)
        }
        
     }

     useEffect(() => {
        const getComments=async () => {  
            try {
                const {data,status}=await axios.get(`/comments/getpostcomment/${postId}`,           
                );
                console.log('comment getting ',data);

                  if(status===200){
                    setComments(data?.comments);
                    console.log('comment getting success ',data);

                  }
                  else{
                    console.log('comment getting failure ');

                  }
    
            } catch (e) {
                console.error('Error in getting Post Comment', e)
            }
            
        }
        getComments();
     }, [postId]);
     const handleLike=async (id) => {
        try {
            if(!currUser)navigate('/login');
            const {data,status}=await axios.put(`/comments/likecomment/${id}`,   
                         

            );
          
            console.log('comment liking  ',data);

            if(status===201){
             console.log('comment liking success');
setComments(comments.map((comment)=>
    comment._id===id ? {...comment,likes:data.comment.likes,numberOfLikes:data.comment.numberOfLikes}:comment
))
            }
            else{
              console.log(' comment liking failure    ')
              
            }
        } catch (e) {
            console.error('Error in liking comment', e)
        }
        
       }
     

       const handleEdit=async (comment,editedContent) => {
        setComments(comments.map((c)=>
        comment._id===c._id ? {...c,content:editedContent}:c))
         }

         const handleDelete=async (commentId) => { 
          setShowModal(false);
            if(!currUser)navigate('/login');
    try {
        const {status}=await axios.delete(`/comments/deletecomment/${commentId}`
);
        console.log('comment deleting');

        if(status===200){
          console.log('comment deleting success');

            setComments(comments.filter((comment)=>comment._id !==commentId));
       
        }
        else{
          console.log('comment deleting failure ');

        }
    } catch (e) {
        console.error('Error in deleting comment', e)
    }
    
          }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
    {currUser ? (
      <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
        <p>Signed in as:</p>
        <img
          className='h-5 w-5 object-cover rounded-full'
          src={currUser?.user?.profilePicture}
          alt=''
        />
        <Link
          to={'/dashboard?tab=profile'}
          className='text-xs text-cyan-600 hover:underline'
        >
          @{currUser?.user?.name}
        </Link>
      </div>
    ) : (
      <div className='text-sm text-teal-500 my-5 flex gap-1'>
        You must be signed in to comment.
        <Link className='text-blue-500 hover:underline' to={'/login'}>
          Sign In
        </Link>
      </div>
    )}
    {currUser && (
      <form
        onSubmit={handleSubmit}
        className='border border-teal-500 rounded-md p-3'
      >
        <Textarea
          placeholder='Add a comment...'
          rows='3'
          maxLength='200'
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <div className='flex justify-between items-center mt-5'>
          <p className='text-gray-500 text-xs'>
            {200 - comment?.length} characters remaining
          </p>
          <button type="submit" class="group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-gradient-to-br from-purple-600 to-cyan-500 enabled:hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800 border-0 rounded-lg focus:ring-2"><span class="items-center flex justify-center bg-white text-gray-900 transition-all duration-75 ease-in group-enabled:group-hover:bg-opacity-0 group-enabled:group-hover:text-inherit dark:bg-gray-900 dark:text-white w-full rounded-md text-sm px-4 py-2 border border-transparent">Submit</span></button>


        </div>
        {commentError && (
          <Alert message={commentError} success={false}/>
          
        )}
      </form>
    )}
    {comments?.length === 0 ? (
      <p className='text-sm my-5'>No comments yet!</p>
    ) : (
      <>
        <div className='text-sm my-5 flex items-center gap-1'>
          <p>Comments</p>
          <div className='border border-gray-400 py-1 px-2 rounded-sm'>
            <p>{comments?.length}</p>
          </div>
        </div>
        {comments?.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onLike={handleLike}
            onEdit={handleEdit}
            onDelete={(commentId) => {
              setShowModal(true);
              setId(commentId);
            }}
          />
        ))}
      </>
    )}
    <Modal
      show={showModal}
      onClose={() => setShowModal(false)}
      popup
      size='md'
      className='w-1/3 mx-auto'
    >
      <Modal.Header />
      <Modal.Body>
        <div className='text-center'>
          <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
          <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
            Are you sure you want to delete this comment?
          </h3>
          <div className='flex justify-center gap-4'>
            <Button
              color='failure'
              onClick={() => handleDelete(id)}
            >
              Yes, I'm sure
            </Button>
            <Button color='gray' onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </div>
  )
}

export default CommentSection