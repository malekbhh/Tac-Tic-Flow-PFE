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
        <section class="">
          <div class="text-start flex flex-col items-start justify-center py-20 md:py-40">
            <h1 class="text-5xl font-bold leading-tight text-start text-white">
              Empower Your Projects
            </h1>
            <p class="text-3xl font-medium mt-4 text-start text-white">
              with <span class="text-5xl font-bold text-white">TacticFlow</span>
            </p>
            <p class="text-xl mt-4 text-start text-gray-300">
              Organize, collaborate, and track your projects with ease.
            </p>
            <div class="flex justify-center mt-8">
              <div class="flex flex-row">
                <input
                  type="email"
                  class="border border-gray-300 rounded-3xl pr-11 px-3 py-2 mr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  placeholder="Enter your email"
                  required
                />
                <button
                  type="button"
                  class="text-center text-white bg-gradient-to-r from-indigo-500 to-indigo-700
      hover:from-indigo-600 hover:to-indigo-800
      hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out animate-pulse
        transform
 hover:scale-105"
                >
                  Verifiy Account existe or no
                  <i class="fa fa-user-plus" aria-hidden="true"></i>
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
