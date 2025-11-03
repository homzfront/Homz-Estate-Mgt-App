import React from 'react'

const EditIcon = ({ color = "#4E4E4E" }) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={color}>
            <path d="M7.33301 1.83301H5.99967C2.66634 1.83301 1.33301 3.16634 1.33301 6.49967V10.4997C1.33301 13.833 2.66634 15.1663 5.99967 15.1663H9.99967C13.333 15.1663 14.6663 13.833 14.6663 10.4997V9.16634" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.6933 2.5135L5.43992 7.76684C5.23992 7.96684 5.03992 8.36017 4.99992 8.64684L4.71325 10.6535C4.60659 11.3802 5.11992 11.8868 5.84659 11.7868L7.85325 11.5002C8.13325 11.4602 8.52659 11.2602 8.73325 11.0602L13.9866 5.80684C14.8933 4.90017 15.3199 3.84684 13.9866 2.5135C12.6533 1.18017 11.5999 1.60684 10.6933 2.5135Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.94043 3.2666C10.3871 4.85993 11.6338 6.1066 13.2338 6.55993" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default EditIcon