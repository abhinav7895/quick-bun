'use client'

import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { PackageIcon, Clipboard, LoaderCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from 'sonner'
import { Package } from "@/types/types"
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useCompletion } from 'ai/react'

import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'

SyntaxHighlighter.registerLanguage('js', js)
SyntaxHighlighter.registerLanguage('ts', ts)
SyntaxHighlighter.registerLanguage('bash', bash)

const Packages = ({ packages }: { packages: Package[] }) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const { complete, completion, isLoading, stop,  setCompletion } = useCompletion({
    api: '/api/generate-documentation',
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy')
    })
  }

  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg)
    setIsDialogOpen(true)
  }

  const generateDocumentation = async () => {
    if (!selectedPackage) return
    await complete(selectedPackage.name)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCompletion('');
    stop()
  }

  const CodeBlock = ({ inline, className, children }: any) => {
    const match = /language-(\w+)/.exec(className || '')
    const lang = match && match[1] ? match[1] : ''

    if (inline) {
      return <code className={className}>{children}</code>
    }

    return (
      <SyntaxHighlighter
        style={tomorrow}
        language={lang}
        PreTag="div"
        customStyle={{
          margin: '0.5em 0',
          padding: '1em',
          overflow: 'auto',
          fontSize: '0.9em',
          lineHeight: '1.5',
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    )
  }

  return (
    <div className='flex sm:p-3 flex-col gap-3 mt-8'>
      <AnimatePresence>
        {packages.map(({ name, description, url }, index) => (
          <motion.div
            key={name + index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className='relative items-center hover:scale-105 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2 flex gap-3 py-2 cursor-pointer'
            onClick={() => handlePackageClick({ name, description, url })}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              className='border bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 p-1 rounded-lg'
            >
              <PackageIcon className='size-8 sm:size-10 text-neutral-600 dark:text-neutral-400' />
            </motion.div>
            <div className="flex-grow">
              <motion.a
                href={url}
                className='text-base sm:text-lg underline text-neutral-700 dark:text-neutral-200'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                {name}
              </motion.a>
              <motion.p
                className='text-xs sm:text-sm line-clamp-1 text-neutral-500 dark:text-neutral-400'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
              >
                {description}
              </motion.p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className='absolute top-2 right-2' asChild>
                <Button className='size-5 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600  active:scale-90 transition-all border-neutral-400 dark:border-neutral-500 border rounded px-0' onClick={(e) => e.stopPropagation()}>
                  <Clipboard className='size-3 text-neutral-600 dark:text-neutral-300' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-50">
                <DropdownMenuItem className='text-sm cursor-pointer' onClick={(e) => { e.stopPropagation(); copyToClipboard(`npm install ${name}`); }}>
                  Copy npm command
                </DropdownMenuItem>
                <DropdownMenuItem className='text-sm cursor-pointer' onClick={(e) => { e.stopPropagation(); copyToClipboard(`yarn add ${name}`); }}>
                  Copy yarn command
                </DropdownMenuItem>
                <DropdownMenuItem className='text-sm cursor-pointer' onClick={(e) => { e.stopPropagation(); copyToClipboard(`pnpm add ${name}`); }}>
                  Copy pnpm command
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        ))}
      </AnimatePresence>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="w-full rounded-lg sm:max-w-[625px] h-auto">
          <DialogHeader>
            <DialogTitle className="text-lg text-left sm:text-xl">{selectedPackage?.name}</DialogTitle>
            <DialogDescription className="text-sm text-left sm:text-base">{selectedPackage?.description}</DialogDescription>
          </DialogHeader>
          <div className="py-4 overflow-y-auto max-h-[calc(90vh-200px)] sm:max-h-[400px]">
            {completion ? (
              <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: CodeBlock
                  }}
                >
                  {completion}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm sm:text-base text-neutral-600">Click the button below to generate documentation.</p>
            )}
          </div>
          {(!completion || isLoading) && <DialogFooter>
            <Button onClick={generateDocumentation} disabled={isLoading} className="w-full text-neutral-50 sm:w-auto">
              {isLoading ? <LoaderCircle className=' animate-spin' /> : 'Generate Documentation'}
            </Button>
          </DialogFooter>}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Packages