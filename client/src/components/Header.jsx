import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { RxCross1 } from "react-icons/rx";
import clsx from "clsx";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa6";
import { toggleTheme } from "../redux/theme/themeSlice";
import { Button } from "flowbite-react";

const Header = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [st, setState] = useState(false);
  const { currUser } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const toggleDropdown = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (!currUser) setOpen(false);
  }, [currUser]);

  const handleLogOut = async () => {
    try {
      const data = await axios.post("/logout");
      if (data.status === 200) {
        dispatch(signoutSuccess());
        navigate("/");
      } else {
        console.log("Logout not successful");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header>
        <div className="w-screen border-b-2 flex justify-between dark:bg-gray-800 p-2 items-center">
          <div className="flex items-center space-x-4 lg:p-3">
            <GiHamburgerMenu
              id="hamburger"
              onClick={() => setState(true)}
              className="text-2xl lg:hidden cursor-pointer"
            />
            <Link
              to="/"
              className="self-center text-sm sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-purple-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Prasu's
              </span>
              Blog
            </Link>
            <div className="hidden lg:block">
              <div className="ml-10 flex space-x-11 font-serif ">
                <Link
                  to={"/"}
                  className=" text-gray-800 hover:text-purple-700 dark:text-white dark:hover:text-purple-500"
                >
                  Home
                </Link>
                <Link
                  to={"/about"}
                  className="text-gray-800 hover:text-purple-700 dark:text-white dark:hover:text-purple-500"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden lg:w-1/5 lg:block ">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 pl-12 pr-4 py-2 border text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <AiOutlineSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white"
                  size={20}
                />
              </div>
            </form>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-10">
            <div className="relative inline-block text-left ">
              {currUser ? (
                <>
                  <Button
                    className={`${
                      currUser ? "visible" : "hidden"
                    } w-12 h-10     absolute top-0 right-12 sm:right-16   mx-4  inline  focus:ring-2`}
                    color="gray"
                    pill
                    onClick={() => dispatch(toggleTheme())}
                  >
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                  </Button>
                  <div
                    onClick={toggleDropdown}
                    className="cursor-pointer mr-3 md:mr-6 sb-avatar sb-avatar--src"
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      width: "40px",
                      height: "40px",
                      borderRadius: "100%",
                      fontFamily: "Helvetica, Arial, sans-serif",
                    }}
                  >
                    <img
                      className="cursor-pointer mr-3 md:mr-6 sb-avatar__image"
                      width="40px"
                      height="40px"
                      src={currUser?.user?.profilePicture}
                      style={{
                        maxWidth: "100%",
                        width: "40px",
                        height: "40px",
                        borderRadius: "100%",
                      }}
                      alt="Avatar"
                    />
                  </div>
                  {open && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-2">
                        <p className="block px-4 py-2 text-sm text-gray-700">
                          @{currUser?.user?.name}
                        </p>
                        <Link to={`/dashboard?tab=profile`}>
                          <button className="block text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Profile
                          </button>
                        </Link>
                        <button
                          onClick={handleLogOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex ">
                  <Button
                    className={`w-12 h-10     absolute top-0 right-24 sm:right-28   mx-4  inline  focus:ring-2`}
                    color="gray"
                    pill
                    onClick={() => dispatch(toggleTheme())}
                  >
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                  </Button>

                  {/* <Link to={"/pro"}>
                    
                    <button
                      type="button"
                      class="group sm:mr-6 mr-3 flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-gradient-to-br from-purple-600 to-cyan-500 enabled:hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800 border-0 rounded-lg focus:ring-2"
                    >
                      <span class="items-center flex justify-center bg-white text-gray-900 transition-all duration-75 ease-in group-enabled:group-hover:bg-opacity-0 group-enabled:group-hover:text-inherit dark:bg-gray-900 dark:text-white w-full rounded-md text-sm px-4 py-2 border border-transparent">
                       Subscribe to Pro
                      </span>
                    </button>
                  </Link> */}
                  <Link to={"/login"}>
                    
                    <button
                      type="button"
                      class="group sm:mr-6 mr-3 flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-gradient-to-br from-purple-600 to-cyan-500 enabled:hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800 border-0 rounded-lg focus:ring-2"
                    >
                      <span class="items-center flex justify-center bg-white text-gray-900 transition-all duration-75 ease-in group-enabled:group-hover:bg-opacity-0 group-enabled:group-hover:text-inherit dark:bg-gray-900 dark:text-white w-full rounded-md text-sm px-4 py-2 border border-transparent">
                        Sign in
                      </span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          id="mobile-navbar"
          className={clsx(
            "absolute z-10 top-0 left-0 w-screen h-full bg-black/20 backdrop-blur-sm -translate-x-full",
            st && "translate-x-0"
          )}
        >
          <div className="bg-white dark:bg-gray-800 w-3/5 h-full p-7">
            <RxCross1
              id="Cross-icon"
              onClick={() => setState(false)}
              className="text-2xl mb-5 cursor-pointer"
            />
            <form onSubmit={handleSubmit}>
              <div className="relative my-8">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-gray-50 dark:bg-gray-700 pl-12 pr-4 py-2 border text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <AiOutlineSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white"
                  size={20}
                />
              </div>
            </form>
            <div className="block">
              <div className="flex  flex-col  font-serif ">
                <Link
                  to={"/"}
                  className="mb-2 text-xl  hover:text-purple-700 dark:text-white dark:hover:text-purple-500"
                >
                  Home
                </Link>
                <Link
                  to={"/about"}
                  className=" text-xl hover:text-purple-700 dark:text-white dark:hover:text-purple-500"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
