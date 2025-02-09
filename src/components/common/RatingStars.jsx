import React, { useEffect, useState } from "react"
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti"

function RatingStars({ Review_Count, Star_Size }) {
  const [starCount, SetStarCount] = useState({
    full: 0,
    half: 0,
    empty: 0,
  })

  useEffect(() => {
    const rating = parseFloat(Review_Count) || 0
    const fullStars = Math.floor(rating)
    const decimal = rating - fullStars
    const hasHalfStar = decimal >= 0.5

    SetStarCount({
      full: fullStars,
      half: hasHalfStar ? 1 : 0,
      empty: 5 - fullStars - (hasHalfStar ? 1 : 0),
    })
  }, [Review_Count])

  return (
    <div className="flex gap-1 text-yellow-100">
      {[...Array(starCount.full)].map((_, i) => (
        <TiStarFullOutline 
          key={`full-${i}`} 
          size={Star_Size || 20} 
          className="text-yellow-100"
        />
      ))}
      
      {starCount.half > 0 && (
        <TiStarHalfOutline 
          size={Star_Size || 20} 
          className="text-yellow-100"
        />
      )}
      
      {[...Array(starCount.empty)].map((_, i) => (
        <TiStarOutline 
          key={`empty-${i}`} 
          size={Star_Size || 20} 
          className="text-yellow-100"
        />
      ))}
    </div>
  )
}

export default RatingStars