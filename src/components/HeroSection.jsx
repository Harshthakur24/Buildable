import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { HSFContent } from '../../constants'

const HeroSection = () => {

    const isDesktop = useMediaQuery({ minWidth: 767})
    const mobile = useMediaQuery({ maxWidth:767 })

    return (
    <div className='relative flex flex-col m:pt-[90px] min-h-[350px] w-full items-center justify-center bg-[#f4f3fa] m:gap-[15px] s:gap-[5px]'>
        <div className='flex flex-col text-[55px] min-h-[10px] max-w-[800px] m:w-11/12 items-center justify-start gap-[5px]'>
            <h1 className='font-semibold m:text-[90px] m:leading-[80px] text-[#26253b] m:tracking-[-4px] s:leading-[40px] s:text-[55px] s:tracking-[-2px]'>{HSFContent.title}</h1>
            <div className='flex items-center justify-center m:gap-[20px] s:gap-[10px] w-full'>
                <div className='flex flex-row items-center justify-center m:gap-[15px] s:gap-[10px]'>
                    <h1 className='font-semibold m:leading-[80px] m:text-[90px] m:tracking-[-4px] text-[#26253b] s:leading-[50px] s:text-[55px] s:tracking-[-2px]'>{HSFContent.subTItle}</h1>
                    <img src={HSFContent.imageSrc} alt 
                        className='m:w-[60px] m:h-[60px] s:w-[40px] s:h-[40px] mt-[5px] bg-center' />
                </div>
                <h1 className='font-semibold  text-[#f84f39] m:text-[90px] m:leading-[80px] m:tracking-[-4px] s:text-[55px] s:leading-[50px] s:tracking-[-2px]'>{HSFContent.highlightText}</h1>
            </div>
        </div>
        <div className='flex m:leading-[30px] s:leading-[25px] font-semibold text-[20px] pb-[10px] pt-[5px] m:max-w-[600px] s:max-w-[350px] w-[905px] items-center justify-center flex-col text-center text-[#72718a] m:my-[0px] s:my-[10px]'>
            {isDesktop && <div>
                {HSFContent.descriptionDesktop}
            </div>}
            {mobile && <div>
                {HSFContent.descriptionMobile}
            </div> }
        </div>
        <div className='flex mb-[60px] min-h-[62px] max-w-[900px] items-center justify-center flex-row gap-[15px] w-11/12'>
            <a className='text-[#f4f3f8] whitespace-nowrap break-keep bg-[#f84f39] rounded-[600px] px-[30px] py-[10px] text-[20px] font-semibold transition-all duration-200 ease-in-out'>
                {HSFContent.PBT1}
                <span className=''>{HSFContent.PBT2}</span>
            </a>
            <a className='transition-all duration-200 ease-in-out font-semibold text-[20px] py-[10px] rounded-[60px] text-[#f4f3f8] bg-[#6b66da] items-center justify-center pl-[30px] pr-[25px] '>{HSFContent.secondaryButtonText}</a>
        </div>
    </div>
  )
}

export default HeroSection