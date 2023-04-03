import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { Configuration, OpenAIApi } from 'openai'
import clientPromise from '../../lib/mongodb'

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res)
  const client = await clientPromise
  const db = client.db('ai_blog')
  const userProfile = await db.collection('users').findOne({
    auth0Id: user.sub,
  })
  if (!userProfile?.availableTokens) {
    res.status(403).json({ message: 'Not enough tokens' })
    return
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(config)

  const { topic, keywords } = req.body

  if (!topic || !keywords) {
    res.status(422).json({ message: 'Missing topic or keywords' })
    return
  }

  if (topic.length > 100 || keywords.length > 100) {
    res.status(422).json({ message: 'Topic or keywords too long' })
    return
  }

  const postContentResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'you are a blog post generator',
      },
      {
        role: 'user',
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
  The content should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`,
      },
    ],
  })
  const postContent =
    postContentResponse.data.choices[0]?.message?.content || ''
  const titleResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'you are a blog post generator',
      },
      {
        role: 'user',
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
  The content should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`,
      },
      {
        role: 'assistant',
        content: postContent,
      },
      {
        role: 'user',
        content:
          'Generate appropriate title tag content for the above blog post.',
      },
    ],
  })
  const metaDescriptionResponse = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'you are a blog post generator',
      },
      {
        role: 'user',
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
        The content should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`,
      },
      {
        role: 'assistant',
        content: postContent,
      },
      {
        role: 'user',
        content:
          'Generate SEO-friendly meta description content for the above blog post.',
      },
    ],
  })

  const title = titleResponse.data.choices[0]?.message?.content || ''
  const metaDescription = console.log('POST CONTENT: ', postContentResponse)
  console.log('TITLE: ', title)
  console.log('META DESCRIPTION: ', metaDescription)

  await db.collection('users').updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: { availableTokens: -1 },
    }
  )
  const newPost = { postContent, title, metaDescription }
  const post = await db.collection('posts').insertOne({
    postContent: newPost?.postContent,
    title: newPost?.title,
    metaDescription: newPost?.metaDescription,
    userId: userProfile._id,
    topic,
    keywords,
    createdAt: new Date(),
  })

  res.status(200).json({
    // postContent,
    // title,
    // metaDescription,
    postId: post.insertedId,
  })
})

// metaDescriptionResponse.data.choices[0]?.message.content

// DAVINCI 003 MODEL
// const response = await openai.createCompletion({
//   model: 'text-davinci-003',
//   temperature: 0,
//   max_tokens: 3600,
//   prompt: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
//   The content should be formatted in SEO-friendly HTML.
//   The response must also include appropriate HTML title and meta description content.
//   The return format must be stringified JSON in the following format:
//   {
//     "postContent": "The HTML content of the post.",
//     "title": "The title of the post.",
//     "metaDescription": "The meta description of the post."
//   }`,
// })
// DAVINCI 003 MODEL RESPONSE
// res.status(200).json({ post: JSON.parse(response.data.choices[0]?.text) })
