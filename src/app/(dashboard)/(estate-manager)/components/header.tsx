import SearchIcon from '@/components/icons/estateManager/searchIcon'
import React from 'react'

const Header = () => {
    return (
        <div className='header'>
            <div className='relative'>
                <input
                    className='border border-[#A9A9A9] h-[45px] pl-4 pr-8 rounded-[4px]'
                />
                <div className='absolute top-2 left-4'>
                    <SearchIcon />
                </div>
            </div>
        </div>
    )
}

export default Header