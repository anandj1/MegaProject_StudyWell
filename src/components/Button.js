import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({active,children,linkto}) => {
  return (
    <Link to = {linkto}>
    <div className={`text-center text-[15px] px-5 py-2 ml-1 w- rounded-lg font-bold  shadow-custom-shadow 
    ${active? " bg-purple-600 text-yellow-400 ":" bg-orange-400 text-purple-900 font-bold "} hover:scale-95 transition-all duration-200`} >
    {children}

    </div>
    </Link>
  )


  
}



export default Button