import React from 'react'

const EmptyAvatar = ({ className = "#292D32" }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill={className} />
            <path d="M11.9963 14.5C6.98625 14.5 2.90625 17.86 2.90625 22C2.90625 22.28 3.12625 22.5 3.40625 22.5H20.5863C20.8663 22.5 21.0863 22.28 21.0863 22C21.0863 17.86 17.0063 14.5 11.9963 14.5Z" fill={className} />
        </svg>
    )
}

export default EmptyAvatar