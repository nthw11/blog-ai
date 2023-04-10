import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AppLayout } from '../components/AppLayout'
import { getAppProps } from '../utils/getAppProps'

export default function TokenTopup() {
  const handleClick = async () => {
    const result = await fetch('/api/addTokens', {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
    })
    const json = await result.json()

    window.location.href = json.session.url
  }

  return (
    <div className='mx-auto'>
      <h1>Purchase more tokens</h1>
      <button className='btn' onClick={handleClick}>
        Add tokens
      </button>
      <h4>Add 10 tokens for $9</h4>
      <h4>PLEASE NOTE</h4>
      <p>
        This is a demo app, but the Stripe integration is real. You will be
        charged $9 for 10 tokens.
      </p>
    </div>
  )
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx)
    return {
      props,
    }
  },
})
