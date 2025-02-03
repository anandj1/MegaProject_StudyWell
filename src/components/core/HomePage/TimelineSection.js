import React from "react";
import Logo1 from "../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../assets/TimeLineLogo/Logo4.svg"
import timeline from "../assets/Images/TimelineImage.png"

const TimeLines = [
    {
      Logo: Logo1,
      Heading: "Leadership",
      Description: "Fully committed to the success company",
    },
    {
      Logo: Logo2,
      Heading: "Responsibility",
      Description: "Students will always be our top priority",
    },
    {
      Logo: Logo3,
      Heading: "Flexibility",
      Description: "The ability to switch is an important skills",
    },
    {
      Logo: Logo4,
      Heading: "Solve the problem",
      Description: "Code your way to a solution",
    },
  ];


const TimeLine = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-20 mb-20 items-center font-nunito text-[20px]">
        <div className="lg:w-[50%] flex flex-col gap-16 ">
          {TimeLines.map((element, i) => {
            return (
              <div className="flex flex-col lg:gap-3" key={i}>
                <div className="flex gap-6" key={i}>
                  <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012]">
                    <img src={element.Logo} alt="" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[18px] ">{element.Heading}</h2>
                    <p className=" text-base font-">{element.Description}</p>
                  </div>
                </div>
                </div>

              
              
            );
          })}
          </div>

          <div className=" w-[50%] relative  shadow-custom-shadow border rounded-md mt-1">

            <img src={timeline} alt="timelineimage"></img>
            <div className="relative w-fit h-fit shadow-blue-200">
          <div className="absolute  lg:bottom-0 lg:translate-x-[10%] lg:translate-y-[10%] bg-purple-400 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10 ">
            {/* Section 1 */}
            <div className="flex gap-5 items-center lg:border-r border-blue-800 px-7 lg:px-14">
              <h1 className="text-3xl font-bold w-[75px]">10</h1>
              <h1 className=" text-blue-800 text-sm w-[75px] font-bold">
                Years experiences
              </h1>
            </div>

            {/* Section 2 */}
            <div className="flex gap-5 items-center lg:px-14 px-7">
              <h1 className="text-3xl font-bold w-[75px]">250</h1>
              <h1 className="text-blue-800 text-sm w-[75px] font-bold">
                types of courses
              </h1>
            </div>
            <div></div>
          </div>
          </div>

          </div>
    
          </div>
          </div>
  )
} 
export default TimeLine