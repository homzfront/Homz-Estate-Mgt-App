import React from 'react'

const ShareIcon = ({ className = "#4E4E4E" }) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.93313 4.71344L10.5931 2.82677C13.1331 1.9801 14.5131 3.36677 13.6731 5.90677L11.7865 11.5668C10.5198 15.3734 8.43979 15.3734 7.17313 11.5668L6.61312 9.88677L4.93313 9.32677C1.12646 8.0601 1.12646 5.98677 4.93313 4.71344Z" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.74023 9.60036L9.1269 7.20703" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default ShareIcon