import React from 'react'

const MoreIcon = ({ className = "#202020", classNameII = "#292D32" }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00055 6.21203C8.79388 6.21203 9.44055 5.56536 9.44055 4.77203C9.44055 3.9787 8.79388 3.33203 8.00055 3.33203C7.20721 3.33203 6.56055 3.9787 6.56055 4.77203C6.56055 5.56536 7.20721 6.21203 8.00055 6.21203Z" fill={className} stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.52594 12.6652C5.31927 12.6652 5.96594 12.0185 5.96594 11.2252C5.96594 10.4318 5.31927 9.78516 4.52594 9.78516C3.7326 9.78516 3.08594 10.4318 3.08594 11.2252C3.08594 12.0185 3.72594 12.6652 4.52594 12.6652Z" fill={className} stroke={classNameII} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.4732 12.6652C12.2665 12.6652 12.9132 12.0185 12.9132 11.2252C12.9132 10.4318 12.2665 9.78516 11.4732 9.78516C10.6799 9.78516 10.0332 10.4318 10.0332 11.2252C10.0332 12.0185 10.6799 12.6652 11.4732 12.6652Z" fill={className} stroke={classNameII} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default MoreIcon