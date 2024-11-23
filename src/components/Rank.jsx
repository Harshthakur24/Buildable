import React from 'react'
import { RanksLinks } from '../../constants'

const Rank = () => {
  return (
    <div>
        <div className='flex m:flex-row pt-[100px] l:pt-[60px] m:py-[50px] mb-[40px] w-[100%] items-center justify-center lg:gap-[50px] l:gap-[40px] m:gap-[25px] s:gap-[20px]'>
            {RanksLinks.map((link,index) => (
                <a key={index} className='min-h-[10px] l:w-[200px]  m:w-[150px] s:w-[23%]'>
                    <img src={link} className='inline-block w-full align-middle' />
              </a>
            ))}
        </div>
    </div>
  )
}

export default Rank