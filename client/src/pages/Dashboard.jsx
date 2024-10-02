import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import DashPost from '../components/DashPost';
import DashUsers from '../components/DashUsers';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashboardComp from '../components/DashboardComp';
import DashComments from '../components/DashComments';

const Dashboard = () => {
  const location=useLocation();
  const [tab,setTab]=useState('');
  useEffect(() => {
    const tabURL=new URLSearchParams(location.search);
    const tabFromURL=tabURL.get('tab');
    if(tabFromURL)setTab(tabFromURL);
  }, [location.search]);
  

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
    <div className='md:w-56'>
      {/* Sidebar */}
      <DashSidebar />
    </div>
    {/* profile... */}

    
    {tab === 'profile' && <DashProfile />}
    {/* posts... */}
    {tab === 'posts' && <DashPost />}
    {/* users */}
    {tab === 'users' && <DashUsers />}
    {tab === 'comments' && <DashComments />}
      {/* dashboard comp */}
      {tab === 'dash' && <DashboardComp />}
    {/* comments  */}
      
  </div>
  )
}

export default Dashboard