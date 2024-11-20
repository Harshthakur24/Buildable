import React from 'react'
import { SuperListColor } from '../../constants'

const Footer = () => {
  const { sections, updates, copyright } = SuperListColor;

  return (
    <div className='min-h-[400px] w-[100%] items-center justify-center flex flex-col'>
      <div className='flex pb-[50px] pt-[100px] min-h-[510px] w-[100%] items-center justify-start flex-col bg-[#20202e] gap-y-[60px]'>
        <div className='flex  py-[65px] px-[100px] min-h-[100px] max-w-[1250px] w-[95%] justify-center rounded-[40px] '>
          {sections.map(( item, index ) => (
            <div key={index} className='flex flex-1'>
            <div className='flex min-w-auto items-stretch flex-1 flex-col text-[#f8f8f8] gap-x-[5px]'>
              {<div className={`flex font-semibold text-[18px] pt-[10px] mb-[10px] h-[30px] min-w-auto w-auto items-center`} style={{color: item.titleColor}}>
                { item.title }
              </div>}
              {
                item.labels.map((list,index) => (
                  <div key={index} className='relative flex transition-opacity duration-150 leading-[30px] text-[14px] min-h-[39px] h-auto w-[85%] items-center'>
                    <a className='leading-[30px] font-normal text-[15px] flex-1 tracking-[0.1px] text-[#f8f8f8] cursor-pointer hover:text-[rgb(130,129,129)]'>{list}</a>
                  </div>
                ))
              }
              
            </div>
          </div>
          ))}
          <div className='flex flex-1 max-w-[230px]'>
            <div className='flex flex-col min-w-auto items-stretch'>
              <div className='flex font-semibold text-[18px] pt-[10px] mb-[10px] h-[30px] min-w-auto w-auto items-center'>
                <div className='text-[#8f89fa]'>{updates.title}</div>
              </div>
              <div className='mt-[20px]'>
                <div className='flex transition-all duration-300 ease-in-out pt-[15px] pb-[20px] pr-[50px] pl-[20px] w-[90%] items-start flex-col rounded-[15px] gap-x-[15px] bg-[#2c2c3d]'>
                  <a className='leading-[35px] font-semibold rounded-[10px] max-w-[100%]'>
                    <div className='text-[30px] text-[#33b887]'>
                      {updates.text}
                    </div>
                  </a>
                  <a className='flex transition-all duration-200 py-[5px] px-[14px] mt-[15px] items-center rounded-[30px] bg-[#33b887]'>
                    <div className='inline-block font-semibold text-[14px] pr-[4px] text-[#fff]'>{updates.version}</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='relative flex min-h-[50px] w-[100%] items-center justify-center flex-col'>
          <div className='relative flex transition-colors duration-200 h-[40px] w-auto items-center justify-center flex-col cursor-pointer opacity-1 text-[#696f81]'>
            <div className='font-medium opacity-1'>
            {copyright}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer