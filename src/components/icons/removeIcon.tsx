import React from 'react'

const RemoveIcon = ({ className = "#D92D20" }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.0026 14.6654C11.6693 14.6654 14.6693 11.6654 14.6693 7.9987C14.6693 4.33203 11.6693 1.33203 8.0026 1.33203C4.33594 1.33203 1.33594 4.33203 1.33594 7.9987C1.33594 11.6654 4.33594 14.6654 8.0026 14.6654Z" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.11719 9.88661L9.89052 6.11328" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.89052 9.88661L6.11719 6.11328" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default RemoveIcon