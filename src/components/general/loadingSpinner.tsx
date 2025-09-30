"use client"
import React from 'react'

type LoadingSpinnerProps = {
  size?: number | string
  color?: string
  className?: string
  label?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 28,
  color = '#006aff',
  className = '',
  label = 'Loading…',
}) => {
  const px = typeof size === 'number' ? `${size}px` : size
  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-live="polite" aria-label={label}>
      <svg
        style={{ width: px, height: px }}
        className="animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="#E6EEF8" strokeWidth="4" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke={color} strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  )
}

export default LoadingSpinner
