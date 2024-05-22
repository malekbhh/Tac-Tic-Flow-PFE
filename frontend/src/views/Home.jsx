import React from "react";
import NavbarHome from "../components/NavbarHome";
import FooterHome from "../components/FooterHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import FeatureCard from "../components/FeatureCard";

function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-base md:text-lg">
      <NavbarHome className="shadow-md bg-white" />
      <div className="flex flex-col md:flex-row justify-around items-center text-white py-20 px-4 ">
        <section className="flex mx-6 flex-col items-start justify-center text-start">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in-down">
            Empower Your Projects
          </h1>
          <p className="text-2xl md:text-3xl font-medium mt-4 animate-fade-in-up">
            with{" "}
            <span className="text-4xl md:text-5xl font-bold">TacticFlow</span>
          </p>
          <p className="text-lg md:text-xl mt-4 text-gray-300 animate-fade-in-up">
            Organize, collaborate, and track your projects with ease.
          </p>
          <p className="text-base md:text-lg mt-2 md:w-[480px] w-[350px] text-gray-300 animate-fade-in-up">
            TacticFlow provides an intuitive interface for managing your tasks,
            enabling seamless team collaboration, and tracking progress in
            real-time.
          </p>
        </section>
        <div className="w-full md:w-5/12 mt-10 md:mt-0">
          <img
            alt="TacticFlow illustration"
            src="/clip-path-group@2x.png"
            className="max-w-full h-auto transform hover:scale-105 transition duration-300 ease-in-out"
          />
        </div>
      </div>

      <div id="features" className="flex mb-64 flex-wrap  justify-around">
        <FeatureCard
          title="Intuitive Task Management"
          description="Effortlessly organize tasks with an intuitive interface, ensuring smooth workflow and easy task tracking."
          icon="fas fa-tasks"
          image="/consumer-1@2x.png"
        />
        <FeatureCard
          title="Live Project Insights"
          description="Stay updated with real-time project insights, providing comprehensive data visualization for effective decision-making."
          icon="fas fa-chart-line"
          image="/graphic-1@2x.png"
        />
        <FeatureCard
          title="Enhanced Team Collaboration"
          description="Foster seamless collaboration among team members with advanced communication tools and productivity-enhancing features."
          icon="fas fa-users"
          image="/network-1@2x.png"
        />
      </div>
      <div
        className="welcome-section text-white py-20 flex flex-col items-center shadow-lg rounded-lg mx-4 md:mx-0 mt-10 animate-fade-in-up"
        style={{
          background: "linear-gradient(234.84deg, #212177 27.56%, #ce3fa5)",
        }}
      >
        <h2 className="text-4xl font-bold mb-4 animate-bounce">
          Welcome to TacticFlow! 🎉
        </h2>
        <p className="text-lg md:text-xl max-w-3xl text-center mt-4">
          We're excited to have you on board. Dive into a world where project
          management is not only efficient but also enjoyable. Let's make your
          projects flow seamlessly together!
        </p>
        <p className="text-base md:text-lg mt-4 max-w-xl text-center">
          Together, we'll achieve great things!
        </p>
        <div className="mt-6">
          <button className="bg-white text-indigo-500 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-indigo-100 transition duration-300 ease-in-out transform hover:scale-105">
            Get Started <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>
      </div>
      <div id="footer">
        {" "}
        <FooterHome />
      </div>
    </div>
  );
}

export default Home;
