import React from 'react'

const BlueTick = ({ className = "#006AFF" }) => {
    return (
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.6663 1.5L5.49967 10.6667L1.33301 6.5" stroke={className} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default BlueTick