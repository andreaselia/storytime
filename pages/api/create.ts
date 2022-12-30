import type { NextApiRequest, NextApiResponse } from 'next'
import qstashClient from '../../lib/qstash'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(400).json({
      message: `Invalid request method: ${req.method}.`,
    })
  }

  const { theme, character, moral }: any = req.body

  qstashClient.publishJSON({
    url: 'https://api.openai.com/v1/completions',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
      'Content-Type': 'application/json',
      'Upstash-Callback': `${process.env.SITE_URL}/api/callback`,
      'Upstash-Forward-Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: {
      model: 'text-davinci-003',
      prompt: `Write a children's story about ${theme}, which has a main character who is ${character} with the moral of the story being ${moral}.`,
      max_tokens: 500,
      temperature: 0.75,
    },
  })
    .then((data: any) => {
      return res.status(202).json({ id: data.messageId })
    })
    .catch((error: any) => {
      return res.status(500).json({ message: error.message })
    })
}
