import Image from 'next/image'
import HeroImage from '../public/ai_blog_hero.webp'
import { Logo } from '../components/Logo'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='w-screen h-screen overflow-hidden flex justify-center items-center relative'>
      <Image src={HeroImage} alt='Hero image' fill className='absolute' />
      <div className='relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm'>
        <Logo />
        <p>Use AI to Generate Blog Posts</p>
        <Link href='/post/new' className='btn'>
          Begin
        </Link>
      </div>
    </div>
  )
}
