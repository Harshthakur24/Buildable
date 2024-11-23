import React from 'react';
import { ImagesForOL } from '../../constants';

const ImageOverLapping = () => {
  return (
    <div className='flex pl-[40px] pt-[35px] pr-[35px] min-h-[50px] w-full items-center'>
        {ImagesForOL.map((link,index) => (
                    <img key={index} src={link} 
                    className={`relative -mr-[15px] h-[36px] w-[36px] rounded-[40px] border-[2px] border-[#fff]`} style={{zIndex: 97-index}} />
        ))}
        <div className='ml-[22px] font-semibold text-[#b9b9da]'>+6</div>
    </div>
  )
}

export default ImageOverLapping