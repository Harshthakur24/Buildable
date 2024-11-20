import {motion,  useMotionValueEvent,  useScroll, useTransform } from 'framer-motion';
import React, { useState } from 'react'

const SignUp = () => {
  const [hover, setHover] = useState("rgb(248,79,57)");
  const { scrollYProgress } = useScroll();
  const [isHovered, setIsHovered] = useState(false);


  const scale = useTransform(scrollYProgress, [0.86, 0.92], [1, 0.75]);
  const borderRadius = useTransform(scrollYProgress, [0.85, 0.90], ["120px", "450px"]);

  const colors = [
    "rgb(248,79,57)",  // Red
    "rgb(34,129,217)", // Blue
    "rgb(42,150 111)", // Green
    "rgb(107,102,218)"
  ]
  
  const getRandomColor = () => {
    return colors[Math.floor(Math.random()*colors.length)];
  }

  const handleMouseEnter = () => {
    setHover(getRandomColor());
    setIsHovered(true)
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  return (
    <div className='bg-[#20202e] flex pb-[10vh] min-h-screen w-[100%] items-center justify-center'>
        <motion.div 
          style={{
            scale: scale,
            borderRadius: borderRadius,
            backgroundColor: hover,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className='min-h-[75vh] max-h-[600px] w-[100%] flex justify-center items-center text-[70px] text-center text-[#f8f8f8] font-semibold'>
            <div>Sign up for free</div>
        </motion.div>
    </div>
  )
}

export default SignUp