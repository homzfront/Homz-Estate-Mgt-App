import MessageIcon from '@/components/icons/estateManager&Resident/desktop/messageIcon'
import NotiIcon from '@/components/icons/estateManager&Resident/desktop/notiIcon'
import SearchIcon from '@/components/icons/estateManager&Resident/desktop/searchIcon'
import Image from 'next/image'
import React from 'react'

const Header = () => {
    
    return (
        <div className='header'>
            <div className='flex items-center justify-between px-8 h-[120px]'> 
                <div className='relative'>
                    <input
                        className='border border-[#A9A9A9] h-[45px] pl-10 pr-4 rounded-[4px] placeholder:text-[#A9A9A9] placeholder:text-sm w-[355px]'
                        placeholder='Access Code'
                    />
                    <div className='absolute top-3.5 left-4'>
                        <SearchIcon />
                    </div>
                </div>
                <div className='flex gap-3 items-center'>
                    <button>
                        <NotiIcon />
                    </button>
                    <button>
                        <MessageIcon />
                    </button>
                    <button>
                        <Image
                            src={"/manOnCall.jpg"}
                            objectFit='contain'
                            width={40}
                            height={40}
                            alt='profile-img'
                            className='w-[40px] h-[40px] rounded-full object-cover'
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header