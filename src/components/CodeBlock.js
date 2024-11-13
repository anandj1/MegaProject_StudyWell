import React from 'react'
import Button from './Button'
import { FaArrowRightLong } from "react-icons/fa6"
import { TypeAnimation } from 'react-type-animation'





const CodeBlock = ({
    position,heading,subhead, btn1,btn2,  codeblock}) => {
  return (
    <div className={` flex ${position} my-20 justify-between`}>


    {/* Section 1 of codeblock */}

    <div className=' w-[40%] flex flex-col gap-8'>
        <div className=' text-[2.3rem] space-x-8'>{heading}</div>
        <div className=' text-red-300 font-bold text-xl w-[80%]'>{subhead}</div>

        <div className=' flex gap-7 mt-2'>
            <Button active={btn1.active} linkto={btn1.linkto}>
                <div className=' flex gap-2 items-center text-[1rem]'>
                    {btn1.btnText}
                    <FaArrowRightLong />
                </div>
            </Button>

            {/*  btn2 */}
            <Button active={btn2.active} linkto={btn2.linkto}>
                <div className=' flex gap-2 items-center text-[1rem]'>
                    {btn2.btnText}
                    <FaArrowRightLong />
                </div>
            </Button>

        </div>

    </div>


    {/* Section 2 */}

    <div className=' h-[330px] w-[40%] mt-6 flex flex-row py-3 text-[10px] border-[2px] border-blue-400 rounded-md shadow-custom-shadow-1 sm:text-sm leading-[18px] sm:leading-6 relative lg:w-[470px]'>

    <div className="text-center flex flex-col mt-2 w-[10%] select-none text-red-600 font-inter font-bold ">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>

        <div
          className={`w-[70%] flex flex-col gap-2 font-bold font-mono  p-2 rounded-md text-yellow-400 pr-1`}
        >
          <TypeAnimation
            sequence={[codeblock, 1000,""]}
            cursor={true}
            repeat={Infinity}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>

        
    </div>





    </div>
  )
}

export default CodeBlock