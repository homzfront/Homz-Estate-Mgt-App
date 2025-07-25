import React from 'react'

const Reset = ({ className = "white" }) => {
    return (
        <div>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.88281 3.93945H12.1095C13.2162 3.93945 14.1095 4.83279 14.1095 5.93945V8.15279" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.98948 1.83301L2.88281 3.93966L4.98948 6.04635" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.1095 13.06H4.88281C3.77615 13.06 2.88281 12.1667 2.88281 11.06V8.84668" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15.1665L14.1067 13.0598L12 10.9531" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}

export default Reset