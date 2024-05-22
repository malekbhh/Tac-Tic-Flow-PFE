import React from "react";

function FeatureCard({ title, description, icon, image }) {
  return (
    <div className="max-w-md rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
      <div className="px-6 py-4">
        <div className="flex items-center justify-center mb-4">
          {icon && (
            <div className="mr-3 text-indigo-500">
              <i className={icon}></i>
            </div>
          )}
          {image && (
            <img
              src={image}
              alt="feature-image"
              className="w-10 h-10 rounded-full"
            />
          )}
        </div>
        <div>
          <h3 className="text-lg md:text-xl text-center text-white font-bold mb-2">
            {title}
          </h3>
          <p className="text-base text-gray-200">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default FeatureCard;
