'use client'

import { useState } from 'react'
import axios from 'axios'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, LoaderCircle } from 'lucide-react'
import { Fraunces } from 'next/font/google'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Shimmer } from './shimmer'
import { Package } from '@/types/types'
import Packages from './packages'
import { useSession } from 'next-auth/react'

const fraunces = Fraunces({
  weight: [
    "300", "400", "500", "600", "700",
  ],
  subsets: [
    "latin"
  ]
});

const searchPackages = async (query: string): Promise<Package[]> => {
  try {
    const response = await axios.post('/api/get-package', { query });
    return response.data.packages;
  } catch (error) {
    console.error('Error searching packages:', error);
    throw new Error('Failed to search packages');
  }
}

export default function PackageFinder() {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
const session = useSession();
  const handleSearch = async () => {
    if (query === "") return;
    if(session.status === "unauthenticated") 
    setIsLoading(true)
    try {
      const searchResults = await searchPackages(query)
      setResults(searchResults)
    } catch (error) {
      console.error('Error searching packages:', error)
      toast.error('Error searching packages')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto sm:p-4 max-w-2xl">
      <div className='py-20'>
        <div className='space-y-2'>
          <h1 className={cn(fraunces.className, 'text-4xl text-center text-neutral-700 dark:text-neutral-200')}>QuickBun</h1>
          <p className='text-lg text-center dark:text-neutral-400 text-neutral-500'>
            Find top npm packages and generate docs with AI assistance
          </p>    </div>
        <div className='mt-8'>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search for a package..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            />
            <Button className='text-white' onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {
          isLoading ? <Shimmer /> : <Packages packages={results} />
        }
      </div>
    </div>
  )
}
