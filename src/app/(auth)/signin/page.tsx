import { handeSignin } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';
import { Fraunces } from 'next/font/google';
import React from 'react';
import { FcGoogle } from "react-icons/fc";

const fraunces = Fraunces({
    weight: [
        "300", "400", "500", "600", "700",
    ],
    subsets: [
        "latin"
    ]
});

const Signin = () => {

    return (
        <div>
            <div className='flex flex-col relative items-center space-y-2'>
                <div className=' flex gap-2 flex-col items-center text-neutral-600 dark:text-neutral-300'>
                    <Package className='size-10 sm:size-12 ' />
                    <h1 className={cn(fraunces.className, ' text-3xl sm:text-4xl text-center ')}>QuickBun</h1>
                    <p className='text-center text-sm sm:text-base text-neutral-500 dark:text-neutral-400'> Smart npm package recommendations with one-click docs
                    </p>
                </div>
                <form action={handeSignin} className='pt-4'>
                    <Button className=' border border-neutral-300 text-neutral-500 flex items-center gap-1 transition-all hover:bg-neutral-100 hover:border-neutral-400 shadow-none active:scale-90 bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600' >
                        <FcGoogle className='text-lg sm:text-xl' />  Continue with Google
                    </Button>
                </form>
                <footer className='text-neutral-400 pt-2 fixed bottom-6 justify-center w-full text-sm'>
                    <div className='w-fit mx-auto'>
                        @2024 - QuickBun
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Signin