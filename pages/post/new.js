import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AppLayout } from '../../components/AppLayout'
import { getAppProps } from '../../utils/getAppProps'
import { useRouter } from 'next/router'
import { useState } from 'react'
import logo_loading from '../../public/logo_loading.svg'
import Image from 'next/image'

export default function NewPost(props) {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [temperature, setTemperature] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/generatePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, keywords, temperature }),
      })
      const json = await response.json()

      if (json?.postId) {
        router.push(`/post/${json.postId}`)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className='h-full overflow-hidden'>
      {!!loading && (
        <div className='text-green-500 flex h-full w-full flex-col justify-center items-center'>
          <div className='animate-spin absolute top-90 left-100'>
            <Image src={logo_loading} alt='Loading...' />
          </div>
          {/* <FontAwesomeIcon icon={faBrain} className='text-8xl' /> */}
          <h2 className=''>Generating...</h2>
        </div>
      )}
      {!loading && (
        <div className='w-full h-full flex flex-col overflow-auto'>
          <form
            onSubmit={handleSubmit}
            className='m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-color-slate-200 shadow-slate-200'
          >
            <label>
              <strong>Generate a blog post on the topic of: </strong>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm'
              maxLength={80}
            />
            <label>
              <strong>Targeting the following keywords: </strong>
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm'
              maxLength={80}
            />
            <small className='block mb-2'>Separate keywords with a comma</small>
            <div>
              <label>
                <strong>How creative should the post be?</strong>
              </label>
              <div className='flex justify-between items-center'>
                <span className='text-xs'>Safe</span>
                <span className='text-xs'>Very creative</span>
              </div>
              <input
                id='default-range'
                type='range'
                min='0'
                max='1'
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
              />
            </div>

            <button
              type='submit'
              className='btn'
              disabled={!topic.trim() || !keywords.trim()}
            >
              Generate
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx)
    if (!props.availableTokens) {
      return {
        redirect: {
          destination: '/token-topup',
          permanent: false,
        },
      }
    }
    return {
      props,
    }
  },
})
