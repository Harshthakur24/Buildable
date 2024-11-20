import React from 'react'
import { HSSideListContent } from '../../constants'

const HSsideList = () => {

  return (
        <div className='min-h-[100px] w-full items-start flex-1 flex-col'>
            <div className='flex font-medium text-[16px] py-[6px] px-[26px] min-h-[20px] w-full items-start justify-start flex-col text-[#26253b] gap-[8px]'>
                <div className='leading-[18px] font-semibold text-[14px] text-[#72718a]'>{HSSideListContent.title}</div>
            </div>
            {
                HSSideListContent.map((content,index) => (
                    <div key={index} className='flex font-medium text-[16px] min-h-[20px] w-full items-center justify-start flex-row text-[#26253b] transition-all px-[24px] py-[7px] gap-[12px] cursor-pointer hover:bg-[#6c6c9e14]'>
                        <div className='text-[18px]'>{content.image}</div>
                        <div className='leading-[22px] font-medium text-[15px]'>{content.text}</div>
                    </div>
                ))
            }
        </div>
  )
}

export default HSsideList