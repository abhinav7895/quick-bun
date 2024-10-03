'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, PackageIcon, LoaderCircle, Clipboard } from 'lucide-react'
import { Fraunces } from 'next/font/google'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Toaster, toast } from 'sonner'

interface Package {
  name: string;
  description: string;
  url: string;
}

const fraunces = Fraunces({
  weight: [
    "300", "400", "500", "600", "700",
  ],
  subsets: [
    "latin"
  ]
});

// Mock API function (replace with actual API call in a real application)
const searchPackages = async (query: string): Promise<Package[]> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Mock data
  const mockResults: Package[] = [
    { name: 'react-player', description: 'A React component for playing a variety of URLs', url: 'https://www.npmjs.com/package/react-player' },
    { name: 'video.js', description: 'Video.js - open source HTML5 & Flash video player', url: 'https://www.npmjs.com/package/video.js' },
    { name: 'plyr', description: 'A simple, accessible and customizable HTML5, YouTube and Vimeo media player', url: 'https://www.npmjs.com/package/plyr' },
  ]

  return mockResults.filter(pkg =>
    pkg.name.toLowerCase().includes(query.toLowerCase()) ||
    pkg.description.toLowerCase().includes(query.toLowerCase())
  )
}

export default function PackageFinder() {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSearch = async () => {
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
          <h1 className={cn(fraunces.className, 'text-4xl text-center text-neutral-700')}>PackPicker</h1>
          <p className='text-lg text-center text-neutral-500'>Search for npm packages to find what you need</p>
        </div>
        <div className='mt-8'>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search for a package..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {
          isLoading ? <Shimmer /> : <Packages packages={results} />
        }
      </div>
      <Toaster />
    </div>
  )
}

const Shimmer = () => {
  return (
    <div className='flex p-3 flex-col gap-2 mt-8' >
      {
        Array(8).fill("").map((_, index) => {
          return (
            <div key={index} className='max-w-2xl border border-neutral-300 w-full h-3 bg-neutral-200 rounded-full animate-pulse' />
          )
        })
      }
    </div>
  )
}

const Packages = ({ packages }: { packages: Package[] }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy')
    })
  }

  return (
    <div className='flex sm:p-3 flex-col gap-3 mt-8'>
      {
        packages.map(({ name, description, url }, index) => {
          return (
            <div key={name + index} className='relative items-center bg-neutral-50 border border-neutral-200 rounded-lg px-2 flex gap-3 py-2'>
              <div className='border bg-neutral-200 border-neutral-300 p-1 rounded-lg'>
                <PackageIcon className='size-10 text-neutral-600' />
              </div>
              <div className="flex-grow">
                <a href={url} className='text-lg underline text-neutral-700'>{name}</a>
                <p className='text-sm line-clamp-1 text-neutral-500'>{description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className='absolute top-2 right-2' asChild>
                  <Button className='size-5 bg-neutral-200 hover:bg-neutral-100 active:scale-90 transition-all border-neutral-400 border rounded px-0'>
                    <Clipboard className='size-3 text-neutral-600' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-50">
                  <DropdownMenuItem className='text-sm cursor-pointer' onClick={() => copyToClipboard(`npm install ${name}`)}>
                    Copy npm command
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-sm cursor-pointer' onClick={() => copyToClipboard(`yarn add ${name}`)}>
                    Copy yarn command
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-sm cursor-pointer' onClick={() => copyToClipboard(`pnpm add ${name}`)}>
                    Copy pnpm command
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        })
      }
    </div>
  )
}