import React, { ReactNode } from 'react'

const AuthLayout = ({children} : {children : ReactNode}) => {
  return (
    <div className='select-none h-screen px-4 flex justify-center items-center w-full sm:px-10'>
       {children}
    </div>
  )
}

export default AuthLayout