import React from 'react'

const ExportIcon = ({ className = "#4E4E4E" }) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.6665 7.83385L14.1332 2.36719" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14.6668 5.03203V1.83203H11.4668" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.3335 1.83203H6.00016C2.66683 1.83203 1.3335 3.16536 1.3335 6.4987V10.4987C1.3335 13.832 2.66683 15.1654 6.00016 15.1654H10.0002C13.3335 15.1654 14.6668 13.832 14.6668 10.4987V9.16536" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default ExportIcon