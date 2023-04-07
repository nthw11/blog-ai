import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { DM_Sans, DM_Serif_Display, Unica_One } from '@next/font/google'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import { PostsProvider } from '../context/postsContext'
config.autoAddCss = false

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
})
const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-dm-serif',
})
const unicaOne = Unica_One({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-unica-one',
})

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <UserProvider>
      <PostsProvider>
        <main
          className={`${dmSans.variable} ${dmSerifDisplay.variable} ${unicaOne.variable} font-body`}
        >
          {getLayout(<Component {...pageProps} />, pageProps)}
        </main>
      </PostsProvider>
    </UserProvider>
  )
}

export default MyApp
