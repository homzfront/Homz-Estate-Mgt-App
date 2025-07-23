import React from 'react'

const ResetIcon = ({ className = "#006AFF" }) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.38672 3.9375H11.6134C12.7201 3.9375 13.6134 4.83083 13.6134 5.9375V8.15084" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.49339 1.83203L2.38672 3.93868L4.49339 6.04537" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.6134 13.0571H4.38672C3.28005 13.0571 2.38672 12.1638 2.38672 11.0571V8.84375" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.5078 15.1665L13.6145 13.0598L11.5078 10.9531" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default ResetIcon