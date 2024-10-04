import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative">
        <div
          className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span>
        </div>
        <div
          className="absolute top-0 left-0 h-16 w-16 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-indigo-600 align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span>
        </div>
      </div>
    </div>
  );
}