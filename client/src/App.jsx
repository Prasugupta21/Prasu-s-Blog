import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashProfile from "./components/DashProfile";
import Search from "./pages/Search";
import UpdatePost from "./pages/UpdatePost";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import About from "./pages/About";
import Header from "./components/Header";
import FooterSection from "./components/Footer";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <>
    <BrowserRouter >
      <ScrollToTop />
      
     
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/update/:id" element={<DashProfile />} />
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>

          <Route path="/search" element={<Search />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
        <FooterSection/>
   
      </BrowserRouter>
    </>
  );
}

export default App;
