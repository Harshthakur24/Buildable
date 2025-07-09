import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const Video = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll();

    const scale = useTransform(scrollYProgress, [0.49, 0.52, 0.557], [0.8,0.9,1]);
    const borderRadius = useTransform(scrollYProgress,[0.49,0.53, 0.557], ['80px','80px','0px']);

  return (
    <motion.div
        ref={ref}
        style={{
            scale: scale,
            transformOrigin: "center",  
        }}
        className='flex mt-[40px] items-center justify-center flex-col bg-[#fff]'>
        <div className='flex w-full h-full'>
            <a className='flex max-w-full w-full '>
                <motion.video
                    style={{
                        borderTopLeftRadius: borderRadius,
                        borderTopRightRadius: borderRadius,
                    }}
                    autoPlay muted loop playsInline className="w-full h-full">
                    <source src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b303760c5a409c150729db_Ada_palmjc.webp" type="video/webm" />
                </motion.video>
            </a>
        </div>
    </motion.div>
  )
}

export default Video