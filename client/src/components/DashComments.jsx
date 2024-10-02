import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';

export default function DashComments() {
  const { currUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const {data,status}= await axios.get(`/comments/getcomments`)

        if (status===200) {
          setComments(data.comments);
          if (data?.comments?.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currUser?.user?.isAdmin) {
      fetchComments();
    }
    // eslint-disable-next-line
  }, [currUser?.user?._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const { data, status } = await axios.get(`/comments/getcomments?startIndex=${startIndex}`);
      console.log('handle show more ',data);

      if (status === 200) {
        console.log('handle show more success ',data);

        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const { data, status } = await axios.delete(`/comments/deletecomment/${commentIdToDelete}`);
      console.log('deleting comment ',data);

      if (status === 200) {
        console.log('deleting comment success ',data);

        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      
      console.log("server error in deleting comment ",error.message);
    }
  };

  return (
    <div className='overflow-x-auto md:mx-auto p-3 mt-6 x'>
      <h1 className='text-center my-4 font-bold text-2xl mx-auto'>Comments</h1>
      {currUser?.user?.isAdmin && comments.length > 0 ? (
        <>
          
            <table className='min-w-full   text-white bg-black dark:bg-gray-800 shadow-md'>
              <thead className='bg-black dark:bg-gray-700'>
                <tr>
                  <th className='md:px-4 px-1 py-2 text-left'>Date Updated</th>
                  <th className='md:px-4 px-1 py-2 text-left'>Comment Content</th>
                  <th className='md:px-4 px-1 py-2 text-left'>Number of Likes</th>
                  <th className='md:px-4 px-1 py-2 text-left'>Post ID</th>
                  <th className='md:px-4 px-1 py-2 text-left'>User ID</th>
                  <th className='md:px-4 px-1 py-2 text-left'>Delete</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment._id} className='bg-black dark:bg-gray-800'>
                    <td className='border md:px-4 px-1 py-2 text-sm'>{new Date(comment.updatedAt).toLocaleDateString()}</td>
                    <td className='border md:px-4 px-1 py-2 text-sm  '>{comment.content}</td>
                    <td className='border md:px-4 px-1 py-2 text-sm'>{comment.numberOfLikes}</td>
                    <td className='border md:px-4 px-1 py-2 text-sm'>{comment.postId}</td>
                    <td className='border md:px-4 px-1 py-2 text-sm'>{comment.userId}</td>
                    <td className='border md:px-4 px-1 py-2 text-sm'>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
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
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className='text-center'>You have no comments yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
        className='w-1/3 mx-auto mt-48'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button className='bg-red-700' onClick={handleDeleteComment}>
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
}
