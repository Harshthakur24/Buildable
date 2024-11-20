import React from 'react'
import { RanksLinks } from '../../constants'

const Rank = () => {
  return (
    <div>
        <div className='flex pt-[px] mb-[40px] min-h-[180px] w-[100%] items-center justify-center gap-[50px]'>
            {RanksLinks.map((link,index) => (
                <a key={index} className='min-h-[10px] w-[200px]'>
                    <img src={link} className='inline-block w-full align-middle' />
              </a>
            ))}
        </div>
    </div>
  )
}

export default Rank