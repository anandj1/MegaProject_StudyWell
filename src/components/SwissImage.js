import React from 'react'
import HighlightText from '../components/Highlight'
import Button from "../components/Button";
import Know_your_progress from "../assets/Images/Know_your_progress.png";
import Compare_with_others from "../assets/Images/Compare_with_others.svg";
import Plan_your_lessons from "../assets/Images/Plan_your_lessons.svg";

const SwissImage= () => {
  return (
    <div>
        <div className="text-4xl font-semibold text-center my-10">
           <span className=' font-bold font-nunito'>Your swiss knife for </span> 
            <HighlightText text={" learning any language"} />
            <div className="text-center font-medium lg:w-[55%] mx-auto leading-6 text-base mt-5">
              Using spin making learning multiple languages easy. with 20+
              languages realistic voice-over, progress tracking, custom schedule
              and more.
            </div>
            <div className="flex flex-col gap-6 lg:flex-row items-center justify-center mt-8 lg:mt-0">
              <img
                src={Know_your_progress}
                alt=""
                className="object-contain  lg:-mr-32 "
              />
              <img
                src={Compare_with_others}
                alt=""
                className="object-contain lg:-mb-10 lg:-mt-0 -mt-12"
              />
              <img
                src={Plan_your_lessons}
                alt=""
                className="object-contain  lg:-ml-36 lg:-mt-5 -mt-16"
              />
            </div>
          </div>

          <div className="w-fit mx-auto lg:mb-20 mb-8 -mt-4 p-4">
            <Button active={true} linkto={"/signup"}>
              <div className="text-[15px]">Learn More</div>
            </Button>
          </div>
    </div>
  )
}

export default SwissImage