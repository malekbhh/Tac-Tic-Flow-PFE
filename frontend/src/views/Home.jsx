import React from "react";
import NavbarHome from "../components/NavbarHome";
import FooterHome from "../components/FooterHome";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import FeatureCard from "../components/FeatureCard";

function Home() {
  return (
    <div className="flex flex-col min-h-screen ">
      {" "}
      <NavbarHome className="shadow-md bg-white" />
      <div className="flex   flex-col md:flex-row justify-around items-center">
        <section>
          <div className="text-start flex flex-col items-start justify-center py-20 md:py-40">
            <h1 className="text-5xl font-bold leading-tight text-start text-white">
              Empower Your Projects
            </h1>
            <p className="text-3xl font-medium mt-4 text-start text-white">
              with{" "}
              <span className="text-5xl font-bold text-white">TacticFlow</span>
            </p>
            <p className="text-xl mt-4 text-start text-gray-300">
              Organize, collaborate, and track your projects with ease.
            </p>
            <div className="flex justify-center mt-8">
              <div className="flex flex-row">
                <input
                  type="email"
                  className="border border-gray-300 text-xl rounded-3xl pr-11 px-3 py-2 mr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  placeholder="Enter your email"
                  required
                />
                <button
                  type="button"
                  className="text-center text-white bg-gradient-to-r text-xl from-indigo-500 to-indigo-700
 hover:from-indigo-600 hover:to-indigo-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
  font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out animate-pulse transform hover:scale-105"
                >
                  Verifiy Account existe or no
                  <i className="fa fa-user-plus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
        <div className="w-5/12">
          {" "}
          <img
            className="mt-11"
            alt="image"
            src="/clip-path-group@2x.png"
          />{" "}
        </div>{" "}
      </div>
      <div className="features mb-64 flex flex-wrap justify-center items-center mt-40">
        <FeatureCard
          title="Project Organization Hub"
          description="A visual and intuitive platform for organizing tasks into boards, lists, and cards."
          icon="fas fa-tasks"
          image="/consumer-1@2x.png" // Replace with the path to your image
        />

        <FeatureCard
          title="Real-time Project Dashboard"
          description="A comprehensive dashboard that provides real-time insights into the progress of each project."
          icon="fas fa-chart-line"
          image="/graphic-1@2x.png" // Replace with the path to your image
        />

        <FeatureCard
          title="Team Collaboration Hub"
          description="A comprehensive dashboard that provides real-time insights into the progress."
          icon="fas fa-users"
          image="/network-1@2x.png" // Replace with the path to your image
        />
      </div>
      <FooterHome />
    </div>
  );
}

export default Home;
