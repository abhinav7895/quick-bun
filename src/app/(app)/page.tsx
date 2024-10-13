import PackageFinder from "@/components/package-finder";
import dynamic from 'next/dynamic'
 
const Navbar = dynamic(() => import('@/components/navbar'), { ssr: false })

export default function Home() {
  return (
    <main className="max-w-screen-2xl mx-auto px-3 sm:px-10 xl:px-20">
      <Navbar />
      <PackageFinder />
    </main>
  );
}
