import React from 'react'

const RevokeIcon = ({ className = "#D92D20" }) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.75391 12.7057H10.0872C11.9272 12.7057 13.4206 11.2124 13.4206 9.3724C13.4206 7.5324 11.9272 6.03906 10.0872 6.03906H2.75391" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.28674 7.7063L2.58008 5.99964L4.28674 4.29297" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default RevokeIcon