import React from 'react'
import { OverlapCardContent } from '../../constants'

const OverlapCard = () => {

    
  return (
    <div className='relative flex transition-all duration-500 min-h-[100vh] w-full items-center flex-col bg-[#fff] opacity-1 rounded-[80px] mt-[40px]'>
        {
            OverlapCardContent.map((content,index) => (
                <div key={index} className="top-0 m:sticky s:relative flex m:min-h-[100vh] s:min-h-auto w-full items-center justify-center flex-col bg-[#0000] z-[1] l:pb-[0px] s:pb-[30px]"
                style={{ marginTop: index > 0 ? '30px' : '0px'}}>
                    <div className="relative overflow-hidden mt-[20px] flex  s:min-h-[120vh] sm:min-h-[100vh] m:min-h-[90vh]  l:min-h-[90vh] m:w-[95%] s:w-[85%] m:justify-center sm:justify-start s:justify-between m:items-stretch s:items-center opacity-1 z-[9996] l:pb-[0px] m:py-[0px] l:pt-[0px] m:flex-row s:flex-col l:gap-x-[0px] m:gap-x-[0px] s:rounded-[40px] m:rounded-[80px]" 
                        style={{ 
                            backgroundColor: content.bgColor
                            }}>
                        <div className='flex flex-col m:leading-[55px] s:leading-[45px] font-semibold min-h-[40px] m:text-[60px] s:text-[45px] min-w-[50%] m:w-full s:w-auto m:items-center s:items-start justify-center tracking-[-1.5px] gap-x-[2px] l:mt-[0px] m:mt-[20px] sm:mb-[60px] s:mt-[90px] l:mr-[0px] m:mr-[30px] s:mr-[50px]' style={{color: content.textSecondaryColor}}>
                            {content.headingText.map((text,index) => (
                                <div key={index} style={{ color: content.textColor }}>{text}</div>
                            ))}
                            {content.NonColorText.map((text,index) => (
                                <div key={index} style={{ color: content.secColor}}>{text}</div>
                            ))}
                            {content.subtext && (
                                <div className='aspect-auto bottom-0 top-auto left-0 right-0 absolute leading-[22px] font-semibold justify-end text-[18px] mb-[50px] w-[50%] text-center text-[#26253b59] '>{content.subtext}</div>
                            )}
                        </div>
                        <div className='flex w-[100%]  m:min-h-[20vh] s:min-h-[340px] items-center l:justify-center m:justify-start flex-col m:flex-1 min-w-[50%] m:rounded-b-[0px] s:rounded-b-[40px]'
                            style={{ 
                                backgroundColor: content.CardBgColor,
                                }}>
                            <div className='flex h-[110%] w-[110%] items-center justify-center rounded-[20px]'>
                                <iframe src={content.iframeSrc}
                                    className='lg:h-[620px] xl:[620px] lg:w-[470px] l:h-[450px] l:w-[400px] m:h-[350px] m:w-[380px] s:h-[500px] s:w-[350px]'
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