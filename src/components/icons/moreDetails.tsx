import React from 'react'

const MoreDetails = ({ className = "#4E4E4E" }) => {
    return (
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.8337 5.4987V11.9987C13.8337 13.9987 12.6403 14.6654 11.167 14.6654H5.83366C4.36033 14.6654 3.16699 13.9987 3.16699 11.9987V5.4987C3.16699 3.33203 4.36033 2.83203 5.83366 2.83203C5.83366 3.24536 6.00031 3.6187 6.27364 3.89203C6.54697 4.16536 6.92033 4.33203 7.33366 4.33203H9.66699C10.4937 4.33203 11.167 3.6587 11.167 2.83203C12.6403 2.83203 13.8337 3.33203 13.8337 5.4987Z" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.1663 2.83203C11.1663 3.6587 10.493 4.33203 9.66634 4.33203H7.33301C6.91967 4.33203 6.54632 4.16536 6.27299 3.89203C5.99966 3.6187 5.83301 3.24536 5.83301 2.83203C5.83301 2.00536 6.50634 1.33203 7.33301 1.33203H9.66634C10.0797 1.33203 10.453 1.4987 10.7264 1.77203C10.9997 2.04537 11.1663 2.4187 11.1663 2.83203Z" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.83301 8.66797H8.49967" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.83301 11.332H11.1663" stroke={className} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default MoreDetails