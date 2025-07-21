"use client"
import React from 'react'

interface LayoutProps {
  children: React.ReactNode; // Defines children as a ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className=''>
      {children}
    </div>
  )
}

export default Layout;