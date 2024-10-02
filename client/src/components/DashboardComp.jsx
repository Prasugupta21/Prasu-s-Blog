import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiDocumentText,
    HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardComp = () => {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState([]);
    const [lastMonthPosts, setLastMonthPosts] = useState([]);
    const [lastMonthComments, setLastMonthComments] = useState([]);
    const { currUser } = useSelector(state => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const {data,status} = await axios.get('/getusers?limit=5'
                   );
                
                console.log('fetching users',data);

                if (status===200) {
                    console.log('fetching users success' ,data);
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
                
            } catch (error) {
                console.log("server error in fetching users ", error);
            }
        };
        const fetchPosts = async () => {
            try {
                const {data,status} = await axios.get('/posts/getposts?limit=5');
             
                console.log('fetching posts',data);
                if (status===200) {
                    console.log('fetching posts success',data);

                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.log("server error in fetching posts ", error);
            }
        };
        const fetchComments = async () => {
            try {
                const {data,status} = await axios.get('/comments/getcomments?limit=5');
                console.log('fetching comments',data);

                if (status===200) {
                    console.log('fetching comments success',data);

                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.log("server error in fetching comments", error);
            }
        };
        if (currUser?.user?.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currUser]);

    return (
      
        <div className='p-3 md:mx-auto'>
            <div className='flex-wrap flex gap-4 justify-center'>
                <div className='flex flex-col p-3  dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                            <p className='text-2xl'>{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
                            <p className='text-2xl'>{totalComments}</p>
                        </div>
                        <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                            <p className='text-2xl'>{totalPosts}</p>
                        </div>
                        <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
            </div>
            <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold '>
                        <h1 className='text-center p-2  '>Recent users</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={'/dashboard?tab=users'}>See all</Link>
                        </Button>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full '>
                            <thead className='bg-gray-700 dark:bg-gray-800'>
                                <tr >
                                    <th className='px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider'>User image</th>
                                    <th className='px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider'>Username</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {users.map(user => (
                                    <tr key={user._id} className='bg-black'>
                                        <td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200'>
                                            <img
                                                src={user.profilePicture}
                                                alt='user'
                                                className='w-10 h-10 rounded-full bg-gray-500'
                                            />
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200'>{user.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent comments</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={'/dashboard?tab=comments'}>See all</Link>
                        </Button>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-black'>
                            <thead className='bg-gray-700'>
                                <tr>
                                    <th className='px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider'>Comment content</th>
                                    <th className='px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider'>Likes</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {comments.map(comment => (
                                    <tr key={comment._id} className='bg-black'>
                                        <td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200'>
                                            <p className='break-words'>{comment.content}</p>
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200'>{comment.numberOfLikes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent posts</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={'/dashboard?tab=posts'}>See all</Link>
                        </Button>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-black'>
                            <thead className='bg-gray-700'>
                                <tr>
                                    <th className='px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider'>Post image</th>
                                    <th className='px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider'>Post Title</th>
                                    <th className='px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider'>Category</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {posts.map(post => (
                                    <tr key={post._id} className='bg-black'>
                                        <td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200'>
                                            <img
                                                src={post.image}
                                                alt='post'
                                                className='w-14 h-10 rounded-md bg-gray-500'
                                            />
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200'>{post.title}</td>
                                        <td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-white dark:text-gray-200'>{post.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardComp;
