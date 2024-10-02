import React from "react";

const Alert = ({ success, message }) => {
  return (
    <>
      {success ? (
        <>
          <div
            class="flex flex-col gap-2 p-4 text-sm text-green-700 bg-green-100 border-green-500 dark:bg-green-200 dark:text-green-800 rounded-lg mt-2"
            role="alert"
          >
            <div class="flex items-center" data-testid="flowbite-alert-wrapper">
              <div className="mx-auto">{message}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            class="flex flex-col gap-2 p-4 text-sm text-red-700 bg-red-100 border-red-500 dark:bg-red-200 dark:text-red-800 rounded-lg mt-2"
            role="alert"
          >
            <div class="flex items-center" data-testid="flowbite-alert-wrapper">
              <div  className='mx-auto'>{message}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Alert;
