"use client"

import React from 'react'
import { LogOut, MoonStar, PackageIcon, Sun } from 'lucide-react'
import { Fraunces } from 'next/font/google';
import { cn } from '@/lib/utils';
import { signOut } from "next-auth/react"
import { useTheme } from 'next-themes';

const fraunces = Fraunces({
    weight: [
        "300", "400", "500", "600", "700",
    ],
    subsets: [
        "latin"
    ]
});


const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const handleTheme = async () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }
    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/signin" });
    };


    return (
        <>
            <nav className='sm:px-2 py-4'>
                <div className='flex justify-between items-center text-neutral-700 dark:text-neutral-300'>
                    <div className={cn(fraunces.className, "flex text-xl items-center gap-1")}>
                        <PackageIcon className='size-7' />
                    </div>
                    <div className='flex items-center gap-4  '>
                        <button onClick={handleTheme}>
                            {theme === "dark" ? <MoonStar /> : <Sun />}
                        </button>
                        <button onClick={handleLogout} >
                            <LogOut />
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar