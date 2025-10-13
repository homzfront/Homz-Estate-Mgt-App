"use client"

import React, { Suspense } from 'react'
import EstateForm from './estateForm'

// Add estate component
const AddEstate = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EstateForm />
        </Suspense>
    )
}

export default AddEstate