import React from "react";

function FooterHome() {
  return (
    <footer className=" bg-midnightblue py-6 text-white">
      <div className="container mx-auto px-4 flex flex-wrap  justify-between items-center">
        <div className="flex flex-col justify-center  w-full md:w-1/3">
          <div className="flex items-center mb-4">
            <img
              className="h-10 w-auto mb-2 mr-2"
              alt="Logo"
              src="/imageremovebgpreview-81-1@2x.png"
            />
            <h3 className="text-2xl font-bold  text-white">acticFlow</h3>
          </div>
          <p className="text-gray-200 text-base">
            A group of companies, specialized in the field of software
            engineering, computer networks and telecommunications. TAC-TIC has
            today become a subsidiary of the New Ways Group, a group of
            companies, each specialized in a specific field.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center space-y-4 w-full md:w-1/3">
          <b className="text-lg font-bold text-white">Contact</b>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <i className="fas fa-phone-alt mr-2 text-gray-400"></i>
              <p className="text-base"> +216 36 365 558</p>
            </div>
            <div className="flex items-center">
              <i className="fas fa-envelope mr-2 text-gray-400"></i>
              <p className="text-base"> contact@tac-tic.net</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center space-y-4 w-full md:w-1/3  ">
          <b className="text-lg font-bold text-white">Stay Informed</b>
          <div className="w-[173px] flex flex-row items-start justify-center px-6 ">
            {" "}
            <div className="flex flex-col   items-end justify-start  gap-[38px_0px]">
              <div className="flex flex-row justify-between gap-[30px]">
                <img
                  className="h-[46px] w-[46px] relative overflow-hidden "
                  alt="logo"
                  src="/facebook.svg"
                />
                <div className="h-[41px] w-[42px] relative">
                  <img
                    className="absolute top-[0px] left-[0px] w-full h-full "
                    alt="logo"
                    src="/vector-1.svg"
                  />
                  <img
                    className="absolute top-[6.1px] left-[10.7px] w-[25.4px] h-[25px] "
                    alt="logo"
                    src="/vector-2.svg"
                  />
                </div>
              </div>
              <div className="flex flex-row  justify-between gap-[30px]">
                <div className="h-[42px] w-[42px] relative">
                  <img
                    className="absolute top-[0px] left-[0px] w-full h-full z-[1]"
                    alt=""
                    src="/vector-3.svg"
                  />
                  <img
                    className="absolute top-[10px] left-[9px] w-[23px] h-[22px] z-[2]"
                    loading="eager"
                    alt=""
                    src="/vector-4.svg"
                  />
                </div>
                <img
                  className="h-[40.3px] w-[42.9px] relative z-[1]"
                  loading="eager"
                  alt=""
                  src="/group.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center pt-6 mt-6 border-t border-gray-600">
        <p className="text-sm">© 2024 TAC-TIC. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default FooterHome;
