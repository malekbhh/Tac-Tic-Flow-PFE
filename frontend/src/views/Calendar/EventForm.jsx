import React, { useState } from "react";

const EventForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [useEndDate, setUseEndDate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, start, end });
  };

  return (
    <div className="rounded-md w-full p-4  dark:text-gray-300  shadow-md">
      {" "}
      <h2 className="font-bold">Add an Event</h2>
      <form onSubmit={handleSubmit} className="flex items-center gap-6  ">
        <div className="flex items-center ">
          <label htmlFor="title" className="mr-2 text-sm font-semibold">
            Event Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 rounded-md dark:bg-black dark:bg-opacity-30 text-gray-900 dark:text-gray-300 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>
        <div className="flex items-center ">
          <label htmlFor="start" className="mr-2 text-sm font-semibold">
            Start Date:
          </label>
          <input
            id="start"
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="p-2 rounded-md dark:bg-black dark:bg-opacity-30 text-gray-900 dark:text-gray-300 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>
        {useEndDate && (
          <div className="flex items-center ">
            <label htmlFor="end" className="mr-2 text-sm font-semibold">
              End Date:
            </label>
            <input
              id="end"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="p-2 rounded-md  dark:bg-black dark:bg-opacity-30 text-gray-900 dark:text-gray-300 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>
        )}
        <div className="flex items-center ">
          <input
            type="checkbox"
            checked={useEndDate}
            onChange={() => setUseEndDate(!useEndDate)}
            className="mr-2 dark:bg-black dark:bg-opacity-30 text-gray-900 dark:text-gray-300"
          />
          <label htmlFor="useEndDate" className="text-sm font-semibold">
            Use End Date
          </label>
        </div>
        <button
          type="submit"
          className="bg-indigo-500  text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-200 self-center"
        >
          Submit
        </button>
      </form>{" "}
    </div>
  );
};

export default EventForm;
