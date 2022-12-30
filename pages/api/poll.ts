import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../lib/redis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id }: any = req.query

  try {
    const data = await redis.get(id)

    if (!data) {
      return res.status(404).json({ message: 'Data for supplied ID not found' })
    }

    return res.status(200).json(data)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
