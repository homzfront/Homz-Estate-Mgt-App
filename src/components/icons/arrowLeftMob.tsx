import React from 'react'

const ArrowLeftMob = ({ className = "#006AFF", classNameII = "#EEF5FF" }) => {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="8" fill={classNameII} />
            <path d="M16.5005 20.5984L11.0672 15.1651C10.4255 14.5234 10.4255 13.4734 11.0672 12.8318L16.5005 7.39844" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default ArrowLeftMob