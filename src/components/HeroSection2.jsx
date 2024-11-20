import React from 'react'
import Rank from './Rank'
import GridLayout from './GridLayout'
import HSsideList from './HSsideList'
import ImageOverLapping from './ImageOverLapping'

const HeroSection2 = () => {


  return (
    <div className='relative flex transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] pt-[40px] min-h-[200px] w-full items-center flex-col gap-x-[20px] gap-y-[30px] bg-[#f3f2fa]'>
        <div className='relative flex shrink p-[12px] min-h-[700px] max-w-[1250px] w-[95%] items-stretch justify-center rounded-[44px] border-[2px] border-[#b6b6d126] gap-[10px]'>
            <div className='flex w-[240px] min-w-[200px] flex-col rounded-[32px] bg-[#fff]'>
              <GridLayout/>
              <HSsideList />
              <div className='flex p-[24px] min-h-[40px] items-center justify-center gap-[8px]'>
                <div className='h-[48px] flex-1 rounded-[60px] bg-[#c7c7de33]'></div>
                <div className='flex h-[48px] w-[48px] items-center justify-center flex-col rounded-[60px] border-[2px] border-[#b6b6d126]'>
                  <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/64fa30791169686c2af11d89_avatar.jpg" 
                  className='max-w-[100%] inline-block w-[34px] h-[34px] rounded-[60px]' />
                </div>
              </div>
            </div>
            <div className='overflow-hidden max-w-[600px] min-w-[100px] flex flex-row flex-shrink rounded-[32px] bg-[#fff]'>
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
                  <div className='relative flex min-h-auto w-full px-[40px]'>
                    <div className='relative flex min-h-[1px] flex-1 gap-[10px]'>
                      <div className='flex h-full w-[30px] items-start justify-center'>
                        <div className='border-[#F84F39] bg-[#F84F39] h-[25px] w-[25px] flex items-center justify-center flex-col transition-all mt-[2px] rounded-[10px] border-[2px] border-[#6c6c9e4d]'>
                            <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/64fa4c92b1e1d331a802f802_dsfgdf.svg" className='inline-block w-[12px] align-middle max-w-full'/>
                        </div>
                      </div>
                      <div className='flex leading-[28px] font-medium text-[18px] min-h-[1px] items-start flex-col flex-1'>
                        <div className='relative inline-flex text-[#72718A]'>
                          <div className='transition-colors duration-200 w-auto tracking-[-0.2px] '>
                            Launch readiness
                          </div>
                          <div className='absolute inset-0 flex -ml-[2px] h-[30px] w-[104%] items-center transition-all duration-200 ease-in-out'> 
                            <div className='h-[2px] w-full rounded-[30px] bg-[#f84f39]'></div>
                          </div>
                        </div>
                        <div className='flex font-medium text-[18px] mt-[8px] min-h-[10px] w-[100%] gap-[10px]'>
                          <div className='w-[40px] h-[8px] rounded-[50px] bg-[#c7c7de33]'></div>
                          <div className='w-[40px] h-[8px] rounded-[50px] bg-[#c7c7de33]'></div>
                        </div>
                      </div>
                      <div className='relative flex pl-[15px] h-[100%] max-w-[100px] w-auto items-center justify-end bg-[#fff] gap-[12px]'>
                        <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b303760c5a409c150729db_Ada_palmjc.webp" 
                          className='inline-block h-[26px] w-[26px] rounded-[50px]'
                          />
                      </div>
                    </div>
                  </div>
                  <div className='relative flex min-h-auto w-[100%]'>
                    <div className='relative flex min-h-[1px] flex-1 gap-[10px] px-[40px]'>
                      <div className='flex h-full w-[30px] items-start justify-center'>
                        <div className='border-[#F84F39] bg-[#F84F39] h-[25px] w-[25px] flex items-center justify-center flex-col transition-all mt-[2px] rounded-[10px] border-[2px] border-[#6c6c9e4d]'>
                          <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/64fa4c92b1e1d331a802f802_dsfgdf.svg" className='inline-block w-[12px] align-middle max-w-full'/>
                        </div>
                      </div>
                      <div className='flex leading-[28px] font-medium text-[18px] min-h-[1px] items-start flex-col flex-1'>
                        <div className='relative inline-flex text-[#72718A]'>
                          <div className='transition-colors duration-200 w-auto tracking-[-0.2px] '>
                            Value proportion
                          </div>
                          <div className='absolute inset-0 flex -ml-[2px] h-[30px] w-[104%] items-center transition-all duration-200 ease-in-out'> 
                            <div className='h-[2px] w-full rounded-[30px] bg-[#f84f39]'></div>
                          </div>
                        </div>
                      </div>
                      <div className='relative flex pl-[15px] h-[100%] max-w-[100px] w-auto items-center justify-end bg-[#fff] gap-[12px]'>
                        <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b303dbf9cefe4e3524ca84_Gmail_kbjswl.webp" 
                          className='inline-block h-[26px] w-[26px] rounded-[50px]'
                          />
                        <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b30376cfc91a74393dc2c4_Jon_ts9dtj.webp" 
                          className='inline-block h-[26px] w-[26px] rounded-[50px]'
                          />
                      </div>
                    </div>
                  </div>
                  <div className='relative flex min-h-auto w-[100%]'>
                    <div className='relative flex min-h-[1px] flex-1 gap-[10px] px-[40px]'>
                      <div className='flex h-full w-[30px] items-start justify-center'>
                        <div className='h-[25px] w-[25px] flex items-center justify-center flex-col transition-all mt-[2px] rounded-[10px] border-[2px] border-[#6c6c9e4d]'>
                          <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/64fa4c92b1e1d331a802f802_dsfgdf.svg" className='inline-block w-[12px] align-middle max-w-full'/>
                        </div>
                      </div>
                      <div className='flex leading-[28px] font-medium text-[18px] min-h-[1px] items-start flex-col flex-1'>
                        <div className='relative inline-flex'>
                          <div className='transition-colors duration-200 w-auto tracking-[-0.2px] '>
                            Marketing strategy
                          </div>
                        </div>
                      </div>
                      <div className='relative flex pl-[15px] h-[100%] max-w-[100px] w-auto items-center justify-end bg-[#fff] gap-[12px]'>
                        <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b3033a157a61a0e0c349e1_Stan_w0kqid.webp" 
                          className='inline-block h-[26px] w-[26px] rounded-[50px]'
                          />
                      </div>
                    </div>
                  </div>
                  <div className='relative flex min-h-auto w-[100%]'>
                    <div className='relative flex min-h-[1px] flex-1 gap-[10px] px-[40px]'>
                      <div className='flex h-full w-[30px] items-start justify-center'>
                        <div className='h-[25px] w-[25px] flex items-center justify-center flex-col transition-all mt-[2px] rounded-[10px] border-[2px] border-[#6c6c9e4d]'>
                          <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/64fa4c92b1e1d331a802f802_dsfgdf.svg" className='inline-block w-[12px] align-middle max-w-full'/>
                        </div>
                      </div>
                      <div className='flex leading-[28px] font-medium text-[18px] min-h-[1px] items-start flex-col flex-1'>
                        <div className='relative inline-flex'>
                          <div className='transition-colors duration-200 w-auto tracking-[-0.2px] '>
                            Design system update
                          </div>
                        </div>
                      </div>
                      <div className='relative flex pl-[15px] h-[100%] max-w-[100px] w-auto items-center justify-end bg-[#fff] gap-[12px]'>
                        <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b303dbcc8a2e3777f50963_Linear_kf51lo.webp" 
                          className='inline-block h-[26px] w-[26px] rounded-[50px]'
                          />
                        <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b3037613ceae9d94346872_Jenna_vcsqbn.webp" 
                          className='inline-block h-[26px] w-[26px] rounded-[50px]'
                          />
                      </div>
                    </div>
                  </div>
                  <div className='relative flex min-h-auto w-[100%]'>
                    <div className='relative flex min-h-[1px] flex-1 gap-[10px] px-[40px]'>
                      <div className='flex h-full w-[30px] items-start justify-center'>
                        <div className='h-[25px] w-[25px] flex items-center justify-center flex-col transition-all mt-[2px] rounded-[10px] border-[2px] border-[#6c6c9e4d]'>
                          <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/64fa4c92b1e1d331a802f802_dsfgdf.svg" className='inline-block w-[12px] align-middle max-w-full'/>
                        </div>
                      </div>
                      <div className='flex leading-[28px] font-medium text-[18px] min-h-[1px] items-start flex-col flex-1'>
                        <div className='relative inline-flex'>
                          <div className='transition-colors duration-200 w-auto tracking-[-0.2px] '>
                            Website design & dev
                          </div>
                        </div>
                        <div className='flex font-medium text-[18px] mt-[8px] min-h-[10px] w-[100%] gap-[10px]'>
                          <div className='w-[40px] h-[8px] rounded-[50px] bg-[#c7c7de33]'></div>
                          <div className='w-[40px] h-[8px] rounded-[50px] bg-[#c7c7de33]'></div>
                        </div>
                      </div>
                      <div className='relative flex pl-[15px] h-[100%] max-w-[100px] w-auto items-center justify-end bg-[#fff] gap-[12px]'>
                        <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b30376e03051f0ec98c136_Keyla_eaebye.webp" 
                          className='inline-block h-[26px] w-[26px] rounded-[50px]'
                          />
                      </div>
                    </div>
                  </div>
                  <div className='relative flex min-h-auto w-[100%]'>
                    <div className='relative flex min-h-[1px] flex-1 gap-[10px] px-[40px]'>
                      <div className='flex h-full w-[30px] items-start justify-center'>
                        <div className='border-[#F84F39] bg-[#F84F39] h-[25px] w-[25px] flex items-center justify-center flex-col transition-all mt-[2px] rounded-[10px] border-[2px] border-[#6c6c9e4d]'>
                          <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/64fa4c92b1e1d331a802f802_dsfgdf.svg" className='inline-block w-[12px] align-middle max-w-full'/>
                        </div>
                      </div>
                      <div className='flex leading-[28px] font-medium text-[18px] min-h-[1px] items-start flex-col flex-1'>
                        <div className='relative inline-flex text-[#72718A]'>
                          <div className='transition-colors duration-200 w-auto tracking-[-0.2px] '>
                            Pricing strategy
                          </div>
                          <div className='absolute inset-0 flex -ml-[2px] h-[30px] w-[104%] items-center transition-all duration-200 ease-in-out'> 
                            <div className='h-[2px] w-full rounded-[30px] bg-[#f84f39]'></div>
                          </div>
                        </div>
                      </div>
                      <div className='relative flex pl-[15px] h-[100%] max-w-[100px] w-auto items-center justify-end bg-[#fff] gap-[12px]'>
                        <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65ce51c1b01c8a797334f0f5_Slack.png" 
                          className='inline-block h-[26px] w-[26px] rounded-[50px]'
                          />
                        <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b30376cfc91a74393dc2c4_Jon_ts9dtj.webp" 
                          className='inline-block h-[26px] w-[26px] rounded-[50px]'
                          />
                      </div>
                    </div>
                  </div>
                  <div className='relative flex min-h-auto w-[100%]'>
                    <div className='relative flex min-h-[1px] flex-1 gap-[10px] px-[40px]'>
                      <div className='flex h-full w-[30px] items-start justify-center'>
                        <div className=' h-[25px] w-[25px] flex items-center justify-center flex-col transition-all mt-[2px] rounded-[10px] border-[2px] border-[#6c6c9e4d]'>
                          <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/64fa4c92b1e1d331a802f802_dsfgdf.svg" className='inline-block w-[12px] align-middle max-w-full'/>
                        </div>
                      </div>
                      <div className='flex leading-[28px] font-medium text-[18px] min-h-[1px] items-start flex-col flex-1'>
                        <div className='relative inline-flex '>
                          <div className='transition-colors duration-200 w-auto tracking-[-0.2px] '>
                            Prepare analytics
                          </div>
                        </div>
                      </div>
                      <div className='relative flex pl-[15px] h-[100%] max-w-[100px] w-auto items-center justify-end bg-[#fff] gap-[12px]'>
                        <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b303760c5a409c150729db_Ada_palmjc.webp" 
                          className='inline-block h-[26px] w-[26px] rounded-[50px]'
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='overflow-hidden max-w-[380px] min-w-[250px] w-[30%] bg-[#fff] bg-opacity-100 rounded-[32px]'>
                <img src="https://res.cloudinary.com/superlist/image/upload/c_scale,q_66,w_603/v1702316385/website/cities/64ff85f7377dbac9ecd4349e_dream1-min_tqzwgm.webp" 
                className='h-full w-full'/>
            </div>
        </div>
        <Rank />
    </div>
  )
}

export default HeroSection2