import React from 'react'

const AddRound = ({ color = "#4E4E4E" }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.9987 14.6693C11.6654 14.6693 14.6654 11.6693 14.6654 8.0026C14.6654 4.33594 11.6654 1.33594 7.9987 1.33594C4.33203 1.33594 1.33203 4.33594 1.33203 8.0026C1.33203 11.6693 4.33203 14.6693 7.9987 14.6693Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.16797 8.00385L7.05464 9.89052L10.8346 6.11719" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default AddRound