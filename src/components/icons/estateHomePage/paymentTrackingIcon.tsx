import React from 'react'

const PaymentTrackingIcon = ({ className = "#EEF5FF" }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 21H22C22.1339 21 22.25 21.1161 22.25 21.25C22.25 21.3839 22.1339 21.5 22 21.5H2C1.86614 21.5 1.75 21.3839 1.75 21.25C1.75 21.1161 1.86614 21 2 21Z" fill={className} stroke={className} />
            <path d="M11.5498 2.5H12.4502C13.0034 2.50004 13.293 2.67738 13.4609 2.89355C13.6466 3.1329 13.75 3.50568 13.75 4V21.5H10.25V4C10.25 3.50568 10.3534 3.1329 10.5391 2.89355C10.707 2.67738 10.9966 2.50004 11.5498 2.5Z" fill={className} stroke={className} />
            <path d="M3 10V22H7V10C7 8.9 6.6 8 5.4 8H4.6C3.4 8 3 8.9 3 10Z" fill={className} />
            <path d="M17 15V22H21V15C21 13.9 20.6 13 19.4 13H18.6C17.4 13 17 13.9 17 15Z" fill={className} />
        </svg>
    )
}

export default PaymentTrackingIcon