import React from 'react'
import { HScontent } from '../../constants'

const HSLists = () => {
  return (
    <div className='flex flex-col gap-y-[20px]'>
        {
        HScontent.map((content,index) => (
            <div key={index} className='relative flex min-h-auto w-full px-[40px]'>
                <div className='relative flex min-h-[1px] flex-1 gap-[10px]'>
                <div className='flex h-full w-[30px] items-start justify-center'>
                    <div className={` ${content.markColor ? "bg-[#F84F39]" : ""} h-[25px] w-[25px] flex items-center justify-center flex-col transition-all mt-[2px] rounded-[10px] border-[2px] border-[#6c6c9e4d]`}>
                        <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/64fa4c92b1e1d331a802f802_dsfgdf.svg" className='inline-block w-[12px] align-middle max-w-full'/>
                    </div>
                </div>
                <div className='flex leading-[28px] font-medium text-[18px] min-h-[1px] items-start flex-col flex-1'>
                    <div className={`relative inline-flex text-[${content.textColor}]`}>
                    <div className='transition-colors duration-200 w-auto tracking-[-0.2px] '>
                        {content.title}
                    </div>
                    {content.progress && <div className='absolute inset-0 flex -ml-[2px] h-[30px] w-[104%] items-center transition-all duration-200 ease-in-out'> 
                        <div className='h-[2px] w-full rounded-[30px] bg-[#f84f39]'></div>
                    </div>}
                    </div>
                    {content.twoStrips && (<div className='flex font-medium text-[18px] mt-[8px] min-h-[10px] w-[100%] gap-[10px]'>
                        <div className='w-[40px] h-[8px] rounded-[50px] bg-[#c7c7de33]'></div>
                        <div className='w-[40px] h-[8px] rounded-[50px] bg-[#c7c7de33]'></div>
                    </div>)}
                </div>
                <div className='relative flex pl-[15px] h-[100%] max-w-[100px] w-auto items-center justify-end bg-[#fff] gap-[12px]'>
                    {content.images.map((url,index) => (
                        <img key={index} src={url} 
                        className='inline-block h-[26px] w-[26px] rounded-[50px]'
                        />
                    ))}
                </div>
                </div>
            </div>
            ))
        }
    </div>
  )
}

export default HSLists