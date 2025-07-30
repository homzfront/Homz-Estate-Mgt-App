/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { Suspense } from 'react'
import EditEstateForm from './editEstateForm'

const EstateInfo = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditEstateForm />
        </Suspense>
    )
}

export default EstateInfo