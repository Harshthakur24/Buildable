import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import { HSFContent } from '../../constants'

const HeroSection = () => {

    const isDesktop = useMediaQuery({ minWidth: 767})
    const mobile = useMediaQuery({ maxWidth:767 })

    return (
    <div className='relative flex flex-col m:pt-[75px] min-h-[350px] w-full items-center justify-center bg-[#f4f3fa] m:gap-[15px] s:gap-[5px]'>
        <div className='flex flex-col text-[55px] min-h-[10px] max-w-[800px] m:w-11/12 items-center justify-center gap-[5px] text-center'>
            <div className='flex flex-col items-center justify-center gap-[5px]'>
                <h1 className='font-semibold m:text-[90px] m:leading-[80px] text-[#26253b] m:tracking-[-4px] s:leading-[50px] s:text-[55px] s:tracking-[-2px] text-center'>{HSFContent.title}</h1>
                <div className='flex items-center justify-center m:gap-[15px] s:gap-[10px] flex-wrap'>
                    <h1 className='font-semibold m:leading-[80px] m:text-[90px] m:tracking-[-4px] text-[#26253b] s:leading-[50px] s:text-[55px] s:tracking-[-2px]'>{HSFContent.subTItle}</h1>
                    <div className='m:w-[60px] m:h-[60px] s:w-[40px] s:h-[40px] bg-gradient-to-br from-[#f84f39] to-[#6b66da] rounded-full flex items-center justify-center'>
                        <div className='text-white font-bold m:text-[24px] s:text-[16px]'>🚀</div>
                    </div>
                    <h1 className='font-semibold text-[#f84f39] m:text-[90px] m:leading-[80px] m:tracking-[-4px] s:text-[55px] s:leading-[50px] s:tracking-[-2px]'>{HSFContent.highlightText}</h1>
                </div>
            </div>
        </div>
        <div className='flex m:leading-[30px] s:leading-[25px] font-semibold text-[20px] pb-[10px] pt-[5px] m:max-w-[600px] s:max-w-[350px] w-[905px] items-center justify-center flex-col text-center text-[#72718a] m:my-[0px] s:my-[10px]'>
            {isDesktop && <div>
                {HSFContent.description}
            </div>}
            {mobile && <div>
                {HSFContent.description}
            </div> }
        </div>
        <div className='flex mb-[60px] min-h-[62px] max-w-[900px] items-center justify-center flex-row gap-[15px] w-11/12'>
            <Link 
                to="/signup"
                className='text-[#f4f3f8] whitespace-nowrap break-keep bg-[#f84f39] rounded-[600px] px-[30px] py-[10px] text-[20px] font-semibold transition-all duration-200 ease-in-out hover:bg-[#d63027] cursor-pointer inline-block'
            >
                {HSFContent.PBT1}
                <span className=''>{HSFContent.PBT2}</span>
            </Link>
            <Link 
                to="/login"
                className='transition-all duration-200 ease-in-out font-semibold text-[20px] py-[10px] rounded-[60px] text-[#f4f3f8] bg-[#6b66da] items-center justify-center pl-[30px] pr-[25px] hover:bg-[#5753c9] cursor-pointer inline-block'
            >
                {HSFContent.secondaryButtonText}
            </Link>
        </div>

        {/* Floating project cards for visual appeal */}
        <div className='absolute top-[20%] left-[10%] hidden l:block opacity-60'>
            <div className='w-[120px] h-[80px] bg-white rounded-[12px] shadow-lg transform rotate-[-15deg] border border-gray-200'>
                <div className='p-3'>
                    <div className='w-full h-[20px] bg-gradient-to-r from-[#f84f39] to-[#6b66da] rounded mb-2'></div>
                    <div className='w-3/4 h-[8px] bg-gray-200 rounded mb-1'></div>
                    <div className='w-1/2 h-[8px] bg-gray-200 rounded'></div>
                </div>
            </div>
        </div>

        <div className='absolute top-[30%] right-[8%] hidden l:block opacity-60'>
            <div className='w-[120px] h-[80px] bg-white rounded-[12px] shadow-lg transform rotate-[12deg] border border-gray-200'>
                <div className='p-3'>
                    <div className='w-full h-[20px] bg-gradient-to-r from-[#2a966f] to-[#2590f2] rounded mb-2'></div>
                    <div className='w-3/4 h-[8px] bg-gray-200 rounded mb-1'></div>
                    <div className='w-1/2 h-[8px] bg-gray-200 rounded'></div>
                </div>
            </div>
        </div>

        <div className='absolute bottom-[15%] left-[15%] hidden l:block opacity-60'>
            <div className='w-[100px] h-[70px] bg-white rounded-[12px] shadow-lg transform rotate-[8deg] border border-gray-200'>
                <div className='p-2'>
                    <div className='w-full h-[16px] bg-gradient-to-r from-[#6b66da] to-[#f84f39] rounded mb-2'></div>
                    <div className='w-2/3 h-[6px] bg-gray-200 rounded mb-1'></div>
                    <div className='w-1/3 h-[6px] bg-gray-200 rounded'></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HeroSection