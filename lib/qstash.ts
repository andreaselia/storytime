import { Client } from '@upstash/qstash'

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN as string,
})

export default qstashClient
