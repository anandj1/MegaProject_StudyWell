import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({active,children,linkto}) => {
  return (
    <Link to = {linkto}>
    <div className={`text-center text-[15px] px-5 py-2 ml-1 w- rounded-lg font-bold  shadow-custom-shadow 
    ${active? " bg-purple-500 text-orange-300 shadow-lg shadow-orange-100 ":" bg-orange-400 shadow-lg shadow-purple-200 text-purple-900 font-bold "} hover:scale-95 transition-all duration-200`} >
    {children}

    </div>
    </Link>
  )


  
}



export default Button