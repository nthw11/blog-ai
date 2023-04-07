import logo_img from '../../public/logo_img.svg'
import Image from 'next/image'

export const Logo = () => {
  return (
    <div className='text-3xl text-center py-4 font-heading'>
      blog_ai
      <div className='mx-auto'>
        <Image src={logo_img} alt='Logo' className='w-10 h-10 mx-auto my-3' />
      </div>
    </div>
  )
}
