import React from 'react'

const BlueSearch = ({ className = "#006AFF" }) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.66732 14.4987C11.1651 14.4987 14.0007 11.6632 14.0007 8.16536C14.0007 4.66756 11.1651 1.83203 7.66732 1.83203C4.16951 1.83203 1.33398 4.66756 1.33398 8.16536C1.33398 11.6632 4.16951 14.4987 7.66732 14.4987Z" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14.6673 15.1654L13.334 13.832" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default BlueSearch