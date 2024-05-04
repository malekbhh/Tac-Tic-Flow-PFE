import React, { useState } from "react";
import boardicon from "../assets/boardicon.png";
import darkIcon from "../assets/111.png";
import lightIcon from "../assets/daymode.png";
import { Switch } from "@headlessui/react";
import useDarkMode from "../Hooks/useDarkMode";

function HeaderDropdown({ setOpenDropdown, setBoardModalOpen }) {
  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );
  const toggleDarkMode = (checked) => {
    setTheme(colorTheme);
    setDarkSide(checked);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenDropdown(false);
      }}
    >
      <div className=" shadow-sm shadow-[#364e7e1al] rounded-2xl">
        <div>
          <div className="mx-2 p-4 space-x-2  flex justify-center items-center rounded-2xl">
            <img className="h-5" src={lightIcon} alt="lightmodeicon" />
            <Switch
              checked={darkSide}
              className={`${darkSide ? "bg-gray-700" : "bg-gray-200"} 
        relative inline-flex h-6 w-11 items-center rounded-full`}
              onChange={toggleDarkMode}
            >
              <span
                className={`${darkSide ? "translate-x-6" : "translate-x-1"}
         inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <img className="h-4" src={darkIcon} alt="lightmodeicon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderDropdown;
