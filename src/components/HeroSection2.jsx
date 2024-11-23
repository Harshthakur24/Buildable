import React from 'react'
import Rank from './Rank'
import GridLayout from './GridLayout'
import HSsideList from './HSsideList'
import ImageOverLapping from './ImageOverLapping'
import HSLists from './HSLists';

const HeroSection2 = () => {
  

  return (
    <div className='relative flex transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] l:pt-[40px] min-h-[200px] w-full items-center flex-col l:gap-x-[20px] l:gap-y-[30px] bg-[#f3f2fa]'>
        <div className='relative flex shrink p-[12px] l:min-h-[700px] m:min-h-[600px] max-w-[1250px] l:w-[95%] m:w-[70%] s:w-[90%] items-stretch justify-center rounded-[44px] border-[2px] border-[#b6b6d126] gap-[10px]'>
            <div className='hidden l:flex w-[240px] min-w-[200px] flex-col rounded-[32px] bg-[#fff]'>
              <GridLayout/>
              <HSsideList />
              <div className='flex p-[24px] min-h-[40px] items-center justify-center gap-[8px]'>
                <div className='h-[48px] flex-1 rounded-[60px] bg-[#c7c7de33]'></div>
                <div className='flex h-[48px] w-[48px] items-center justify-center flex-col rounded-[60px] border-[2px] border-[#b6b6d126]'>
                  <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/64fa30791169686c2af11d89_avatar.jpg" alt='logo1'
                  className='max-w-[100%] inline-block w-[34px] h-[34px] rounded-[60px]' />
                </div>
              </div>
            </div>
            <div className=' overflow-hidden max-w-[600px] min-w-[100px] flex flex-row flex-shrink rounded-[32px] bg-[#fff]'>
              <div className='flex pb-[30px] min-h-[10px] flex-1 flex-col gap-[20px]'>
                <div className='flex min-h-[40px] w-full flex-col gap-[18px] opacity-100'>
                  <ImageOverLapping />
                  <div className='leading-[40px] font-bold px-[40px] min-h-[10px] w-full text-[#26253b] text-[40px]'>
                    <h2>App Launch</h2>
                  </div>
                  <div className='flex leading-[28px] font-medium text-[18px] pl-[40px] pr-[50px] min-h-[30px] w-full items-start tracking-[-0.5px] gap-[14px]'>
                    <div className='w-auto font-medium tracking-[-0.2px] transition-colors duration-200 ease-in-out'>
                    Hey team, here's a quick recap of what we're working on ahead of the launch. Feel free to add any more notes or details to the tasks.
                    </div>
                  </div>
                  <HSLists/>
                </div>
              </div>
            </div>
            
            <div className='hidden l:flex overflow-hidden max-w-[380px] min-w-[250px] w-[30%] bg-[#fff] bg-opacity-100 rounded-[32px]'>
              <img src="https://res.cloudinary.com/superlist/image/upload/c_scale,q_66,w_603/v1702316385/website/cities/64ff85f7377dbac9ecd4349e_dream1-min_tqzwgm.webp" alt="logo"
              className='h-full w-full'/>
            </div>
        </div>
        <Rank />
    </div>
  )
}

export default HeroSection2