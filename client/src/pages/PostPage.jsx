import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';
import 'prismjs/themes/prism.css'; // Import Prism.js theme
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript.min.js'; // Import necessary Prism.js components
import 'prismjs/components/prism-css.min.js'; // Import other languages as needed
import Alert from '../components/Alert';


export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/posts/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (data.success) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/posts/getposts?limit=3`);
        const data = await res.json();
        if (data.success) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log("server error in fetching recent post ", error.message);
    }
  }, []);

 
  useEffect(() => {
    // Apply Prism.js syntax highlighting after component mounts
    if (post && post.content) {
      Prism.highlightAll();
    }
  }, [post]);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
     {error && (
      <>
      <Alert success={false} message={error}/>
      </>
     )} 
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className='self-center mt-5'
      >
        <Button className='bg-gray-700 dark:bg-white dark:text-gray-700' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className='mt-10 p-3 h-72 w-full'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content ql-editor'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      >
         
      </div>

      <CommentSection postId={post._id} />

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
