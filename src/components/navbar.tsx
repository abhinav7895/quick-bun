import React from 'react'
import { Coins, PackageIcon } from 'lucide-react'
import { Fraunces } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const fraunces = Fraunces({
    weight: [
        "300", "400", "500", "600", "700",
    ],
    subsets: [
        "latin"
    ]
});


const Navbar = () => {
    return (
        <nav className='sm:px-2 py-4'>
            <div className='flex justify-between items-center'>
                <div className={cn(fraunces.className, "flex text-2xl items-center gap-1")}>
                    <PackageIcon className='size-7' /> PackPicker
                </div>
                <div>
                    <Button  className=' flex items-center gap-1 rounded-full active:scale-90 transition-all border border-green-700 '>
                        Get Credits
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar