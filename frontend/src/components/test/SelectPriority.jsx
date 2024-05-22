import React, { useState } from "react";
import arrow from "../../assets/arrow.png";
function SelectPriority({ priority, setPriority }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (value) => {
    setPriority(value);
    setIsOpen(false); // Close the list when an item is clicked
  };

  return (
    <div className="relative inline-block">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border-b-2 bg-transparent border-gray-300 px-2 p-1 focus:border-b-2 focus:outline-none cursor-pointer"
      >
        <div className="w-48 text-black dark:text-white">
          {" "}
          <div className="flex justify-between items-center">
            <p className="   border-gray-300  text-gray-400">
              {" "}
              Select priority
            </p>
            {priority}{" "}
            {isOpen ? (
              <img className="h-3  rotate-180" src={arrow} alt="arrow icon" />
            ) : (
              <img className="h-3" src={arrow} alt="arrow icon" />
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <ul className="  absolute z-10 mt-1 dark:text-gray-200 w-full bg-white dark:bg-slate-900 border border-gray-300 rounded-lg shadow-lg ">
          <li
            className="  items-center  hover:cursor-pointer hover:bg-black hover:bg-opacity-10 m-1 rounded-lg  flex justify-between p-2 dark:hover:bg-indigo-500 dark:hover:bg-opacity-60  "
            onClick={() => handleItemClick("low")}
          >
            Low{" "}
            <span className="   bg-green-400 inline-block w-11 h-4 rounded-lg " />
          </li>
          <li
            className=" items-center  hover:cursor-pointer flex justify-between p-2 hover:bg-black hover:bg-opacity-10 m-1 rounded-lg dark:hover:bg-indigo-500 dark:hover:bg-opacity-60  "
            onClick={() => handleItemClick("medium")}
          >
            Medium
            <span className="bg-orange inline-block w-11 h-4 rounded-lg" />
          </li>
          <li
            className=" items-center  hover:cursor-pointer flex justify-between p-2 hover:bg-black hover:bg-opacity-10 m-1 rounded-lg  dark:hover:bg-indigo-500 dark:hover:bg-opacity-60 "
            onClick={() => handleItemClick("high")}
          >
            High
            <span className="bg-red-500 inline-block  w-11 h-4 rounded-lg" />
          </li>
        </ul>
      )}
    </div>
  );
}

export default SelectPriority;
