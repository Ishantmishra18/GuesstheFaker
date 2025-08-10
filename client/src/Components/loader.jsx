import React from 'react';

const Loader = () => {
  return (
    <div className='fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center'>
      <div className="relative flex flex-col gap-3 items-center">
          <img src="/assets/loader.png" alt=""  className=' animate-bounce h-[20vh]'/>
          <div className="flex">
            Loading<span className="animate-dots"></span>
          </div>
          
        </div>
      </div>
 
  );
};

export default Loader;