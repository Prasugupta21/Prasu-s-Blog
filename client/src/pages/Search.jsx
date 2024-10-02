import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
const Search = () => {
    const  [sideBarData,setSideBarData]=useState({
        searchTerm:'',
        sort:'desc',
        category:'uncategorized'
    });
 
    const [posts,setPosts] =useState([]);
    const [showMore,setShowMore]=useState(false);
    const [loading ,setLoading]=useState(false);
    const location=useLocation();
    const navigate=useNavigate();
    useEffect(()=>{
        const query=new URLSearchParams(location.search);
        const searchTermFromQuery=query.get('searchTerm');
        const sortFromQuery=query.get('sort');
        const categoryFromQuery=query.get('category');

        if(searchTermFromQuery || sortFromQuery || categoryFromQuery){
            setSideBarData({
                ...sideBarData,
                searchTerm:searchTermFromQuery,
                sort:sortFromQuery,
                category:categoryFromQuery
            })
        }

        const fetchPosts=async()=>{
            setLoading(true);
            
            const searchQuery=query.toString();
            try {
              const {data,status}=await axios.get(`/posts/getposts?${searchQuery}`);
              if(status===200){
                  setLoading(false);
                  const postArray=Object.values(data?.posts);

                setPosts(postArray);
                if(data.posts.length===9)setShowMore(true);
                else setShowMore(false);
              }
              else{
                  
                  console.log('Failure in fetching posts');
              }
                  
            } 
              catch (e) {
              console.error('Server Error', e)
            }
                
          
        }

        fetchPosts(); 
        // eslint-disable-next-line
    },[location.search]);
   

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
          setSideBarData({ ...sideBarData, searchTerm: e.target.value });
        }
        if (e.target.id === 'sort') {
          const order = e.target.value || 'desc';
          setSideBarData({ ...sideBarData, sort: order });
        }
        if (e.target.id === 'category') {
          const category = e.target.value || 'uncategorized';
          setSideBarData({ ...sideBarData, category });
        }
      };
    
      const handleSubmit=(e)=>{
    
        e.preventDefault();
        const query=new URLSearchParams(location.search);
        
  
        query.set('searchTerm',sideBarData.searchTerm);
        query.set('sort',sideBarData.sort);
        query.set('category',sideBarData.category);
        const searchQuery=query.toString();
        navigate(
            
            `/search?${searchQuery}`
        )
      }

      const handleShowMore=async()=>{
        
        const query=new URLSearchParams(location.search);
        const numberOfPosts=posts.length;
        const startIndex=numberOfPosts;
    
        query.set('startIndex',startIndex);
        const searchQuery=query.toString();

        try {
            const {data,status}=await axios.get(`/posts/getposts?${searchQuery}`);
        if(status===200){
           const postArray=Object.values(data?.posts);
                  
            setPosts([...posts,...postArray]);
          
            if(postArray.length===9) setShowMore(true);
            else setShowMore(false);
        }
      
        } catch (error) {
            console.log("Server Error " ,error);

        }
        
       
      }
  return (
    <div className='flex flex-col md:flex-row'>
    <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
      <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
        <div className='flex   items-center gap-2'>
          <label className='whitespace-nowrap font-semibold'>
            Search Blog:
          </label>
          <input
            placeholder='Search...'
            id='searchTerm'
            className='bg-gray-50 dark:bg-gray-600 rounded md:w-36 w-28 '
            type='text'
            value={sideBarData.searchTerm}
            onChange={handleChange}

          />
        </div>
        <div className='flex items-center gap-2'>
          <label className='font-semibold'>Sort:</label>
          <select
          onChange={handleChange}
          value={sideBarData.sort}
          id='sort'
          className='bg-gray-50 dark:bg-gray-600 rounded '
          >
            <option  value='desc'>Latest</option>
            <option  value='asc'>Oldest</option>
        
          </select>
        </div>
        <div className='flex items-center gap-2'>
          <label className='font-semibold'>Category:</label>
          <select  
            onChange={handleChange}
            value={sideBarData.category}
            id='category'
               className='bg-gray-50 dark:bg-gray-600 rounded '
          >
            <option value='uncategorized'>Uncategorized</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
            <option value='javascript'>JavaScript</option>
          </select>
        </div>
        <button type="submit" class="group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-gradient-to-r from-purple-500 to-pink-500 enabled:hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800 border-0 rounded-lg focus:ring-2"><span class="items-center flex justify-center bg-white text-gray-900 transition-all duration-75 ease-in group-enabled:group-hover:bg-opacity-0 group-enabled:group-hover:text-inherit dark:bg-gray-900 dark:text-white w-full rounded-md text-sm px-4 py-2 border border-transparent">Apply Filters</span></button>
      </form>
    </div>
    <div className='w-full'>
      <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
        Posts results:
      </h1>
      <div className='p-7 flex flex-wrap gap-4'>
        {!loading && posts.length === 0 && (
          <p className='text-xl text-gray-500'>No posts found.</p>
        )}
        {loading && <p className='text-xl text-gray-500'>Loading...</p>}
        {!loading &&
          posts &&
          posts?.map((post) => 
          
          <PostCard key={post._id} post={post} />)
          
          
          }
        {showMore && (
          <button
            onClick={handleShowMore}
            className='text-teal-500 text-lg hover:underline p-7 w-full'
          >
            Show More
          </button>
        )}
      </div>
    </div>
  </div>
  )
}

export default Search