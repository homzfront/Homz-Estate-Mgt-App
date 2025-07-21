import React from 'react'

const ArrowLeft = ({ className = "#202020" }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.99925 13.2787L5.65258 8.93208C5.13924 8.41875 5.13924 7.57875 5.65258 7.06542L9.99925 2.71875" stroke={className} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default ArrowLeft