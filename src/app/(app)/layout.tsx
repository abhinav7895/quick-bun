"use client"

import React, { ReactNode } from 'react'
import { AppProvider } from '@/context/app-context'

const AppLayout = ({children} : {children : ReactNode}) => {
    
     return (
        <AppProvider>
            {children}
        </AppProvider>
    )
}

export default AppLayout