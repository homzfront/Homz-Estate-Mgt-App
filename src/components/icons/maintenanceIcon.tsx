import React from 'react'

const MaintenanceIcon = ({ className = '#4E4E4E' }) => {
    return (
        <svg width="16" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.9 2.59L10.44 5.05C9.36 6.13 9.05 7.72 9.53 9.14L4.04 14.63C3.34 15.33 3.34 16.46 4.04 17.17L6.82 19.95C7.52 20.65 8.65 20.65 9.36 19.95L14.85 14.46C16.27 14.94 17.86 14.63 18.94 13.55L21.4 11.09C22.2 10.29 22.2 8.97 21.4 8.17L15.83 2.6C15.04 1.8 13.71 1.79 12.9 2.59Z" stroke={className} strokeWidth="1.8" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.89 17.49L8.76 19.36" stroke={className} strokeWidth="1.8" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default MaintenanceIcon