import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios';
import Header from './Header';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// import Header from './Header';

const Home = () => {
// const  dispatch=useDispatch();
const navigate=useNavigate();
const currUser=useSelector((state)=>state.user)

// console.log(state.user?.currUser);
  

useEffect(()=>{
if(!currUser)navigate('/login');
},[currUser])

  return (
    <>
      <Header/>
      
    
     

    
    </>
 
  )
}

export default Home