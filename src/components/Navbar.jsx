import React from 'react'
import { useMediaQuery } from 'react-responsive'

const Navbar = () => {

  const isDesktop = useMediaQuery({ minWidth: 767})
  const tablet = useMediaQuery({ maxWidth: 767})

  return (
    <>
        <div className='p-[8px] l:p-[2px] bg-[#f84f39] '></div>
        <nav className='outer_padding flex px-[40px] m:pt-[30px] pb-[25px] w-full min-h-[70px] items-center justify-between bg-[#f4f3fa]'>
            <div className='leftFlex flex items-center justify-center gap-[25px] font-semibold'>
                <div className='flex items-center gap-[20px]'>
                    <img loading='lazy' src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/663f2f66c6546b588a916dcc_icon.png" alt  className='w-[25px] h-[25px]'/>
                    <img loading='lazy' src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/651e84ae819bbe057aefb9c5_dsfg.svg" alt className='w-[90px] mt-[5px]'/>
                </div>
                <div className='hidden m:block'>
                  <div className='flex gap-[25px] '>
                    <h2 className='hidden l:block'>MacOS</h2>
                    <h2>Web</h2>
                    <h2>iOS</h2>
                    <h2>Andriod</h2>
                  </div>
                </div>
            </div>

            { isDesktop && <div className='RightFlex flex gap-[25px] font-semibold invisible m:visible'>
              <h2>Updates</h2>
              <h2 className='hidden l:block'>Pricing</h2>
              <h2 className='text-[#f84f39]'>Sign In</h2>
              <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/663f2763c6546b588a8a8e69_signin-icon.svg" alt className='w-6' />
            </div>} 
            { tablet &&
              <div className='flex items-center justify-between gap-[20px]'>
                <h2 className='text-[#f84f39] font-semibold'>Download</h2>
                <img src="https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/663f2ed5b99ef9ab02b70a9c_downloadarrow2.svg" className='w-[17px]' />
              </div>
            }
        </nav>
    </>
  )
}

export default Navbar