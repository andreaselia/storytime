import Head from 'next/head'
import { RefObject, useRef, useState } from 'react'
import useInterval from '../hooks/useInterval'

export default function Home() {
  const [generating, setGenerating] = useState<boolean>(false)
  const [messageId, setMessageId] = useState<string|null>(null)
  const [story, setStory] = useState<string[]>([])
  const themeRef: RefObject<HTMLInputElement> = useRef(null)
  const characterRef: RefObject<HTMLInputElement> = useRef(null)
  const moralRef: RefObject<HTMLInputElement> = useRef(null)

  useInterval(async () => {
    await fetch(`/api/poll?id=${messageId}`)
      .then((res: any) => res.json())
      .then((data: any) => {
        if (!data.choices) {
          return
        }

        setGenerating(false)
        setMessageId(null)

        setStory(data.choices[0].text.split('\n\n'))
      })
      .catch((err: any) => console.error(err))
  }, messageId ? 1000 : null)

  async function generateStory(event: any) {
    event.preventDefault()

    setGenerating(true)

    await fetch('/api/create', {
      method: 'POST',
      body: JSON.stringify({
        theme: themeRef.current?.value,
        character: characterRef.current?.value,
        moral: moralRef.current?.value,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res: any) => res.json())
      .then((data: any) => setMessageId(data.id))
      .catch((err: any) => console.error(err))
  }

  return (
    <>
      <Head>
        <title>StoryTime</title>
        <meta name="description" content="A simple Next.js application that allows you to create stories using AI." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="my-16 flex flex-col justify-center items-center md:my-32">
          <h1 className="text-5xl font-black">
            StoryTime
          </h1>

          {story.length > 0 && (
            <div className="mt-10 max-w-3xl mx-auto">
              <div className="w-full prose lg:prose-xl">
                {story.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStory([])}
                  className="mt-6 inline-flex items-center rounded-full border border-transparent bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}

          {story.length == 0 && (
            <form onSubmit={generateStory} className="mt-10 flex flex-col items-center w-full max-w-lg">
              <div className="w-full space-y-4">
                <div>
                  <label htmlFor="theme" className="text-sm font-semibold">
                    My story is about
                  </label>
                  <input
                    name="theme"
                    id="theme"
                    type="text"
                    className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                    placeholder="two friends going on an adventure"
                    ref={themeRef}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="character" className="text-sm font-semibold">
                    My main character is
                  </label>
                  <input
                    name="character"
                    id="character"
                    type="text"
                    className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                    placeholder="a dog named Spot"
                    ref={characterRef}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="moral" className="text-sm font-semibold">
                    The moral of my story is
                  </label>
                  <input
                    name="moral"
                    id="moral"
                    type="text"
                    className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                    placeholder="to always be kind"
                    ref={moralRef}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={generating}
                className="mt-6 inline-flex items-center rounded-full border border-transparent bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate'}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  )
}
