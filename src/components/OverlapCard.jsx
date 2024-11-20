import React from 'react'
import { OverlapCardContent } from '../../constants'


const OverlapCard = () => {
  return (
    <div className='relative flex transition-all duration-500 min-h-[100vh] w-full items-center flex-col bg-[#fff] opacity-1 rounded-[80px] mt-[40px]'>
        {
            OverlapCardContent.map((content,index) => (
                <div key={index} className={`top-0 sticky flex min-h-[100vh] w-full items-center justify-center flex-col bg-[#0000] z-[1] ${index > 0 ? 'mt-[30px]' : ''}`}>
                    <div className='relative flex min-h-[100vh] w-[95%] justify-center rounded-t-[80px] opacity-1 z-[9996]' style={{ backgroundColor: content.bgColor}}>
                        <div className='flex flex-col leading-[55px] font-semibold text-[65px] min-w-[50%] w-full items-center justify-center tracking-[-1.5px] gap-y-[2px]' style={{color: content.textSecondaryColor}}>
                            {content.headingText.map((text,index) => (
                                <div key={index} className={`text-[${content.textColor}]`}>{text}</div>
                            ))}
                            {content.NonColorText.map((text,index) => (
                                <div key={index} className={`text-[${content.secColor}]`}>{text}</div>
                            ))}
                            {content.subtext && (
                                <div className='aspect-auto bottom-0 top-auto left-0 right-0 absolute leading-[22px] font-semibold justify-end text-[18px] mb-[50px] w-[50%] text-center text-[#26253b59] '>{content.subtext}</div>
                            )}
                        </div>
                        <div className={`flex w-[100%] items-center justify-center flex-col min-w-[50%] bg-[${content.CardBgColor}] rounded-tr-[80px]`}>
                            <div className='flex h-[110%] w-[110%] items-center justify-center rounded-[20px]'>
                                <iframe src={content.iframeSrc}
                                    className='h-[650px] w-[650px]'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default OverlapCard