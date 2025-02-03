import React from 'react'
import Button from "../components/Button";
import { FaArrowRight } from "react-icons/fa";
import Instructors from "../assets/Images/Instructor.png";
import Highlight from '../components/Highlight';

const Instructor = () => {
  return (
    <div>
        <div className=" w-11/12 mx-auto flex flex-col lg:flex-row  items-center">
          <div className="lg:w-[50%] mt-20 p-6">
            <img
              src={Instructors}
              alt=""
              className="shadow-white shadow-[-20px_-20px_0_0]"
            />
          </div>
          <div className="lg:w-[50%] flex gap-5 flex-col">
            <h1 className="lg:w-[90%]  text-4xl font-semibold ">
              Become an <br></br>  <Highlight text={"Instructor"} />
            </h1>
           

            <p className="font-medium text-[16px] text-justify w-[70%] text-yellow-200">
              Instructors from around the world teach millions of students on
              StudyWell. We provide the tools and skills to teach what you
              love.
            </p>

            <div className="w-fit mt-3">
              <Button active={true} linkto={"/signup"}>
                <div className="flex items-center gap-3 p-1">
                  Start Teaching Today
                  <FaArrowRight />
                </div>
              </Button>
            </div>
          </div>
        </div>
        
    </div>
  )
}

export default Instructor