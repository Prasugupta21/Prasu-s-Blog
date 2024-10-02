import { Link } from 'react-router-dom';
import { FaLinkedin,FaGithub,FaTwitter,FaFacebook } from "react-icons/fa6";

export default function FooterSection() {
  return (

    <footer className="flex flex-col space-y-10 justify-center bg-white dark:bg-gray-900 border-cyan-400 border-4 m-0 p-6">

   
    <h1 className='text-2xl text-center font-bold text-purple-500 '>Connect with me</h1>
    <div className="flex justify-center space-x-5">

        <a href={"https://www.linkedin.com/in/prasu-gupta-9180bb226/"} target="_blank" rel="noreferrer" >
            <FaLinkedin className='text-3xl hover:text-pink-500 text-blue-500 dark:text-white' />
        </a>
        <a href={"https://www.linkedin.com/in/prasu-gupta-9180bb226/"} target="_blank" rel="noreferrer" >
            <FaGithub className='text-3xl hover:text-pink-500 text-black dark:text-white' />
        </a>
       
        <a href="https://facebook.com" target="_blank"   rel="noreferrer">
            <FaFacebook className='text-3xl hover:text-pink-500 text-blue-500 dark:text-white' />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" >
            <FaTwitter className='text-3xl hover:text-pink-500 text-blue-400 dark:text-white ' />
        </a>
    </div>
    <nav className="flex justify-center flex-wrap gap-4  dark:text-white ">
        <Link className="hover:text-pink-500 text-black dark:text-white" to="/">Home</Link>
        <p className='dark:text-white text-black'> |</p>
        <Link className="hover:text-pink-500 text-black dark:text-white" to="/about">About</Link>
        <p className='dark:text-white text-black'> |</p>
        <Link className="hover:text-pink-500 text-black dark:text-white" to="#">Privacy Policy</Link>
        <p className='dark:text-white text-black '> |</p>

        <Link className="hover:text-pink-500 text-black dark:text-white" to="#">Terms & Condition's</Link>

    </nav>
    <p className="text-center dark:text-gray-700 font-medium">&copy; 2024 <Link className='dark:hover:text-white' href={'https://github.com/Prasugupta21'}
     >Prasu Gupta</Link></p>
</footer>
  )
}