
import { Link, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";

export default function DashSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currUser } = useSelector((state) => state.user);
 
  const handleLogOut = async () => {
    try {
      const data = await axios.post("/logout");
      
      if (data.status === 200) {
        dispatch(signoutSuccess());
        navigate("/login");
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    
  



<nav aria-label="Sidebar" class="h-full w-full md:w-56">
  <div class="h-full overflow-y-auto overflow-x-hidden rounded bg-gray-50 px-3 py-4 dark:bg-gray-800">
    <div class="" data-testid="flowbite-sidebar-items">
      <ul
        data-testid="flowbite-sidebar-item-group"
        class="mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700 flex flex-col gap-1"
      >
        {currUser?.user?.isAdmin && (
          <>
           <Link to="/dashboard?tab=dash">
          <li class="">
            <div
              aria-labelledby="flowbite-sidebar-item-:r1:"
              class="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 20 20"
                aria-hidden="true"
                data-testid="flowbite-sidebar-item-icon"
                class="h-6 w-6 flex-shrink-0 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white text-gray-700 dark:text-gray-100"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              <span
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r1:"
                class="flex-1 whitespace-nowrap px-3"
              >
                Dashboard
              </span>
            </div>
          </li>
        </Link>
          </>
        )}
       
        <Link to="/dashboard?tab=profile">
          <li class="">
            <div
              aria-labelledby="flowbite-sidebar-item-:r3:"
              class="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 20 20"
                aria-hidden="true"
                data-testid="flowbite-sidebar-item-icon"
                class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r3:"
                class="flex-1 whitespace-nowrap px-3"
              >
                Profile
              </span>
              <span
                class="flex h-fit items-center gap-1 font-semibold bg-gray-600 text-gray-100 group-hover:bg-gray-500 dark:bg-gray-900 dark:text-gray-200 dark:group-hover:bg-gray-700 p-1 text-xs rounded px-2 py-0.5"
                data-testid="flowbite-sidebar-label"
              >
                <span>{currUser?.user?.isAdmin ? 'Admin' :'User'}</span>
              </span>
            </div>
          </li>
        </Link>
       
        {currUser?.user?.isAdmin && (
          <>
           <Link to="/dashboard?tab=posts">
          <li class="">
            <div
              aria-labelledby="flowbite-sidebar-item-:r5:"
              class="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 20 20"
                aria-hidden="true"
                data-testid="flowbite-sidebar-item-icon"
                class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r5:"
                class="flex-1 whitespace-nowrap px-3"
              >
                Posts
              </span>
            </div>
          </li>
        </Link>
        </>
        )}

        {currUser?.user?.isAdmin && (<>

          <Link to="/dashboard?tab=users">
          <li class="">
            <div
              aria-labelledby="flowbite-sidebar-item-:r7:"
              class="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
                data-testid="flowbite-sidebar-item-icon"
                class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              <span
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r7:"
                class="flex-1 whitespace-nowrap px-3"
              >
                Users
              </span>
            </div>
          </li>
        </Link>
        </>
        )}
       
       
       
        {currUser?.user?.isAdmin && (<>

          {currUser?.user?.isAdmin && (<>
        </>)}
        <Link to="/dashboard?tab=comments">
          <li class="">
            <div
              aria-labelledby="flowbite-sidebar-item-:r9:"
              class="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 20 20"
                aria-hidden="true"
                data-testid="flowbite-sidebar-item-icon"
                class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span
                data-testid="flowbite-sidebar-item-content"
                id="flowbite-sidebar-item-:r9:"
                class="flex-1 whitespace-nowrap px-3"
              >
                Comments
              </span>
            </div>
          </li>
        </Link>
        </>)}
     
        
        <li className="">
          <Link onClick={handleLogOut}
            aria-labelledby="flowbite-sidebar-item-:rb:"
            class="flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 cursor-pointer"
          >
          
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 20 20"
              aria-hidden="true"
              data-testid="flowbite-sidebar-item-icon"
              class="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span
              data-testid="flowbite-sidebar-item-content"
              id="flowbite-sidebar-item-:rb:"
              class="flex-1 whitespace-nowrap px-3"
            >
              Sign Out
            </span>
        
          </Link>
          </li>
      </ul>
    </div>
  </div>
</nav>

  );
}
