import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../lib/redis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body }: any = req

  try {
    const decoded = Buffer.from(body.body, 'base64').toString('utf-8')

    await redis.set(body.sourceMessageId, decoded)

    return res.status(200).send(decoded)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
