import React from 'react'

const GridLayout = ({ rows = 2, cols = 2 }) => {
  return (
    <div className='flex p-[24px] min-h-[100px] w-full items-center flex-col gap-[8px]'>
            {Array.from({length: rows}).map((_, index) => (
                <div key={index} className='flex min-h-auto w-full items-center justify-center flex-row gap-[8px]'>
                    {Array.from({length: cols}).map((_, index) => (
                        <div key={index} className='h-[62px] flex-1 rounded-[20px] bg-[#c7c7de33]'></div>

                    ))}
                </div>
            ))}
    </div>
  )
}

export default GridLayout