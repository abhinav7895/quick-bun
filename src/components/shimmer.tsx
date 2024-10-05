export const Shimmer = () => {
    return (
      <div className='flex p-3 flex-col gap-2 mt-8' >
        {
          Array(8).fill("").map((_, index) => {
            return (
              <div key={index} className='max-w-2xl border border-neutral-300 dark:border-neutral-700 w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse' />
            )
          })
        }
      </div>
    )
  }
  