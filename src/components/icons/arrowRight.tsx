import React from 'react'

const ArrowRight = ({ className = "white", height = 16, width = 16 }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.93945 13.2787L10.2861 8.93208C10.7995 8.41875 10.7995 7.57875 10.2861 7.06542L5.93945 2.71875" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default ArrowRight