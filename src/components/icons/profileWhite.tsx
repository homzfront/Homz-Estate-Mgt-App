import React from 'react'

const ProfileWhite = ({className = "#ffffff"}) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.0013 7.9987C9.84225 7.9987 11.3346 6.50631 11.3346 4.66536C11.3346 2.82442 9.84225 1.33203 8.0013 1.33203C6.16035 1.33203 4.66797 2.82442 4.66797 4.66536C4.66797 6.50631 6.16035 7.9987 8.0013 7.9987Z" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.7268 14.6667C13.7268 12.0867 11.1601 10 8.0001 10C4.8401 10 2.27344 12.0867 2.27344 14.6667" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default ProfileWhite