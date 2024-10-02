import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashPost = () => {
  const { currUser } = useSelector(state => state.user);
  const [userPost, setUserPost] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postId, setPostId] = useState('');
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const {data,status} = await axios.get(`/posts/getposts?userId=${currUser?.user?._id}`);
        if(status===200){
          setUserPost(data?.posts)
          if (data?.posts?.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log('Server error', error);
      }
    };
    if (currUser?.user?.isAdmin) fetchPosts();
    // eslint-disable-next-line
  }, [currUser?.user?._id]);

  const handleShowMore = async () => {
    const startIndex = userPost.length;
    try {
      const { data, status } = await axios.get(`/posts/getposts?userId=${currUser?.user?._id}&startIndex=${startIndex}`);
      if (status === 200) {
        setUserPost(prev => [...prev, ...data.posts]);
        if (data.posts.length < 9) setShowMore(false);
      } else {
      }
    } catch (e) {
      console.error('Server Error', e);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const {  status } = await axios.delete(`/posts/deletepost/${postId}/${currUser?.user?._id}`);
      console.log('deleting post ');

      if (status === 200) {
        console.log('deleting post success ');

        setUserPost(prev => prev.filter(post => post._id !== postId));
        
      } 
    } catch (e) {
      console.error('Server Error', e);
    }
  };

  return (
    <div className="table-auto overflow-x-auto text-white md:mx-auto p-3 mt-16">
      {currUser?.user?.isAdmin && userPost.length > 0 ? (
        <>

        <h1 className='md:mx-auto flex justify-center  m-4 text-2xl'>Posts</h1>
          <table className="min-w-full bg-black dark:bg-gray-800 shadow-md">
            <thead className="bg-black dark:bg-gray-700 ">
              <tr>
                <th className="md:px-4 py-2 border">Date updated</th>
                <th className="md:px-4 py-2 border">Post image</th>
                <th className="md:px-4 py-2 border ">Post title</th>
                <th className="md:px-4 py-2 border">Category</th>
                <th className="md:px-4 py-2 border">Delete</th>
                <th className="md:px-4 py-2 border">Edit</th>
              </tr>
            </thead>
            <tbody>
              {userPost.map((post) => (
                <tr key={post._id} className="bg-black dark:bg-gray-800">
                  <td className="border px-4 py-2">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-500" />
                    </Link>
                  </td>
                  <td className="border px-4 py-2">
                    <Link className="font-medium  dark:text-white underline" to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{post.category}</td>
                  <td className="border px-4 py-2">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostId(post._id);
                        
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          )}
        </>
      ) : (
        <p className='text-base text-gray-800  dark:text-white'>You have no posts yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md"    className='md:w-1/3   mx-auto mt-32 shadow-slate-800   '>
        <Modal.Header />
        <Modal.Body   >
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button className='bg-red-700' onClick={handleDeletePost} >
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

export default DashPost;
