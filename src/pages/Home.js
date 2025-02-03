import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRightLong } from "react-icons/fa6"
import Highlight from '../components/Highlight'
import Button from '../components/Button'
import Banner from "../assets/Images/banner.mp4"
import CodeBlock from '../components/CodeBlock'
import "../index.css"
import TimeLine from '../components/Timeline'
import SwissImage from '../components/SwissImage'
import Instructor from '../components/Instructor'
import Footer from '../components/common/Footer'
import ExploreMore from '../components/Explore'


const Home = () => {
  return (
    <div>
        {/* Section 1 */}
        <div className=' relative  mx-auto flex flex-col items-center max-w-max text-white font-nunito font-medium justify-between'>

         <Link to={"/signup"}>
         <button className='mx-auto rounded-full font-bold text-xl shaodw-md shadow-purple-500 transition-all text-yellow-50 duration-500 bg-fuchsia-700 p-3 mt-16 hover:scale-110 shadow-lg  hover:bg-fuchsia-800'>
            <div className=' flex items-center gap-6   '>
                <p>Wanna become an Instructor? </p><FaArrowRightLong />


            </div>
         </button>

         </Link>

         <div className=' mt-8 text-3xl '>
          Boost Up Your Future with <Highlight text={"Coding Skills"} /> 
         </div>

         <div className=' w-[75%] font-nunito font-bold text-xl text-red-300 text-center mt-5  '>
         With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
         </div>

         <div className=' flex gap-10 mt-8 '>
          <Button active={true} linkto={"/signup"} >Book a Demo</Button>
          <Button active={false} linkto={"/signup"}> Learn More</Button>
         </div>

         <div className=' shadow-purple-400 w-[70%] m-16 rounded-md shadow-video-shadow'>

         <video muted loop autoPlay>

         <source src={Banner} type='video/mp4'></source>
         



         </video>
         </div>


         {/* {// code block/*  //   */}
         <div className=' max-w-[75%] '>
          <CodeBlock
            position={"lg:flex-row-reverse"}
            heading={
              <div >
                 Uncover Your 
                 <Highlight text={"  Coding Potential   "}/>
                 with our online courses
                
              </div>
            }
              subhead = {
                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
              }
              btn1={
                {
                  btnText : "Try it",
                  linkto : "/signup",
                  active : true
                }
              }
              btn2={
                {
                  btnText : "learn more",
                  linkto : "/login",
                  active : false
                }
              }
              codeblock ={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
              />





             
  
        

         </div>

       



         {/*  Code block -2 */}

         <div className=' max-w-[75%] ml-9'>
          <CodeBlock
            position={"lg:flex-row"}
            heading={
              <div >
                 Start
                 <Highlight text={" coding "}/>
                 in seconds
                
              </div>
            }
              subhead = {
                 "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."              }
              btn1={
                {
                  btnText : "Try it",
                  linkto : "/signup",
                  active : true
                }
              }
              btn2={
                {
                  btnText : "learn more",
                  linkto : "/login",
                  active : false
                }
              }
              codeblock ={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
              />





             
  

         </div>
        

        


         
         <ExploreMore/>
        </div>


        {/* Section 2 */}
        <div className=' bg-blue-100 text-black'>
          <div className='homepage h-[333px]'>
          <div className='w-11/12 max-w-max flex items-center gap-5 mx-auto '>
          <div className=' h-[300px]'></div>
            <div className=' flex flex-row gap-9 text-purple-600 mt-36'>
              <Button active={true} linkto={"/signup"}>
                <div className='flex p-1 items-center gap-3'>Explore More  <FaArrowRightLong/></div>
              </Button>
              <Button active={false} linkto={"/signup"}>
                <div className=' flex p-1 items-center gap-3'> Learn More</div>
              </Button>
            </div>
          </div>


          </div>


        
        <div className='  w-11/12 mx-auto max-w-max flex flex-col items-center justify-between gap-7'>

          <div className=' flex flex-row gap-[110px] w-[80%] mx-auto  mt-10 mb-6 font-nunito'>
            <div className=' text-4xl font-bold w-[45%]'>Get the Skills you need for a  <Highlight text={"Job that is in demand"}/></div>
            <div className="flex flex-col items-start gap-10 w-[40%]">
              <div className="text-[20px] font-nunito">
                The modern StudyWell dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <Button active={true} linkto={"/signup"}>
                <div className="">Learn More</div>
              </Button>
            </div>

          
            
          </div>
          <TimeLine />
          <SwissImage />
        </div>
        </div>


        {/* Section 3 */}


        <div className="   flex flex-col items-center justify-between gap-8 text-white">
        
        <Instructor />
       


        </div>

        {/* Footer */}
        <div className=' bg-blue-400  font-nunito'>
        <Footer/>
        </div>

      
       

    </div>
 
  )
}

export default Home