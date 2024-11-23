import React, { useState } from 'react'
import {ListContent, ListFooter} from '../../constants';
import { useMediaQuery } from 'react-responsive';

const List = () => {
  const [hoverIndex, setHoverIndex] = useState(false);

  const colors = [
    "rgb(248,79,57)",  // Red
    "rgb(34,129,217)", // Blue
    "rgb(51,184,135)", // Green
    "rgb(143,137,250)" // Purple
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random()*colors.length)];
  };

  const handleMOuseEnter = (index) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  }
  const isDesktop = useMediaQuery({ minWidth: 991 });


  return (
    <div className='flex bg-[rgb(32,32,46)] min-h-[500px] py-[200px] transition-colors duration-450 w-[100%] items-center flex-col ll:gap-y-[40px]'>
        <div className='ll:leading-[45px] mm:leading-[35px] ss:leading-[27px] font-semibold ll:text-[45px] ss:text-[35px] min-h-[100px] max-w-[800px] ll:tracking-[-1.5px] ss:tracking-[-1px] text-[#dedeeb] mm:w-[70%] ss:w-[80%]'>
            <div>Lists with</div>
            <div className='text-[#f84f39]'>Super Powers</div>
        </div>
        <div className='Laundry_List flex min-h-[110px] max-w-[800px] ll:w-[70%] ss:w-[80%]  items-center flex-col gap-y-[23px] '>
            {
              ListContent.map((list,index) => (
                <div className='laundry_Row relative flex  ll:min-h-auto  gg:h-[93px] ll:h-[70px] mm:h-[55px] ss:h-[34px]  w-[100%] items-center'>
                  <div style={{
                    color: hoverIndex === index ? getRandomColor() : "rgb(222, 222, 235)",
                    opacity: hoverIndex === index ? 1 : list.opacity ,
                  }}
                  onMouseEnter={() => handleMOuseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  className='gg:leading-[80px] gg:text-[85px] ss:leading-[35px] ss:text-[35px] mm:leading-[70px] mm:text-[50px] ll:text-[60px] font-bold cursor-default whitespace-normal tracking-[-2px] ll:tracking-[-1.5px] transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] break-keep'
                  >
                    <div>{list.text}</div>
                  </div>
                  {isDesktop && hoverIndex === index && (
                    <div className='relative top-0 right-auto bottom-auto left-auto items-center flex leading-[22px] font-normal text-[16px] pl-[20px] ml-[30px] mt-[10px] min-h-auto max-w-[200px] text-[#dedeeb] opacity-1 flex-1'>
                      <div>
                        {list.Subtext}
                      </div>
                    </div>
                  )}
                </div>
              ))
            }
        </div>
        <div className='flex leading-[22px] font-bold text-[20px] min-h-[50px]  max-w-[800px] items-start justify-center flex-col text-[#343440] ll:w-[70%] ss:w-[80%]'>
            <div>The list goes on... </div>
        </div>
        <div className='flex gg:flex-row flex-col pb-[85px] ll:pt-[70px] ss:pt-[120px] min-h-[800px] w-[70%] gg:items-start mm:items-center gg:justify-center mm:justify-start gap-[100px] mm:gap-[40px] ll:gap-[60px]'>
          {ListFooter.map((list,index) => (
            <a key={index} className={`flex min-h-[200px] gg:${index === 0 ? 'max-w-[300px]' : 'max-w-[500px]'} mm:max-w-[500px] min-w-[200px] flex-col gap-[20px]`}>
            <div className='flex pr-[20px] min-h-[30px] w-[100%] items-center'>
              <div className='flex pr-[30px] mr-[30px] min-w-[50px] items-center justify-between border-r-[1px] border-r-solid border-r-[#ffffff1a]'>
                <img src={list.imgUrl} className='inline-block max-h-[24px] align-middle' />
              </div>
              <div className='font-semibold text-[14px] mr-[10px] text-[#dedeeb]'>{list.text}</div>
              <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65ea2435fd6146695bc650dd_arrow.svg" alt loading='lazy' />
            </div>
            <div className='text-[#dedeeb] font-serif text-[30px] font-medium leading-[42px] italic'>
              {list.subtext}
            </div>
          </a>
          ))}
        </div>
    </div>
  )
}

export default List