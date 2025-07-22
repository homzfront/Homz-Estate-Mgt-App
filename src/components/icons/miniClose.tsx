import React from 'react'

const MiniClose = ({ className = "#4E4E4E" }) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00065 15.1654C11.6673 15.1654 14.6673 12.1654 14.6673 8.4987C14.6673 4.83203 11.6673 1.83203 8.00065 1.83203C4.33398 1.83203 1.33398 4.83203 1.33398 8.4987C1.33398 12.1654 4.33398 15.1654 8.00065 15.1654Z" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.11328 10.3866L9.88661 6.61328" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.88661 10.3866L6.11328 6.61328" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default MiniClose