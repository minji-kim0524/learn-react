import { useEffect, useRef, useState } from 'react'
import { LearnSection } from '@/components'

export default function App() {
  const [attach, setAttach] = useState(true)

  // 1. ref callback
  // const refCallback = (el) => {
  //   el?.setAttribute('tabindex', '-1')
  //   el?.focus()

  //   const intervalId = setInterval(() => {
  //     console.log(new Date().toLocaleDateString())
  //   }, 1000)

  //   return () => {
  //     clearInterval(intervalId)
  //   }
  // }

  // 2. useRef + useCallback
  const pRef = useRef(null)
  const intervalRef = useRef()

  useEffect(() => {
    const pElement = pRef.current

    pElement?.setAttribute('tabindex', '-1')
    pElement?.focus()

    intervalRef.current = setInterval(() => {
      console.log(new Date().toLocaleDateString())
    }, 1000)

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [attach])

  return (
    <LearnSection title="DOM 참조">
      <Demo />
      <div className="paragraphes space-y-2 [&_p]:text-gray-700 [&_p]:font-semibold">
        {attach && (
          <div className="bg-amber-300 p-5 pt-2.5 my-2">
            <p
              ref={pRef}
              className="focus:outline-8 outline-offset-2 outline-blue-500/40"
            >
              one
            </p>
          </div>
        )}
        <button
          className="button mt-2"
          onClick={() => {
            setAttach((a) => !a)
            clearInterval(intervalRef.current)
          }}
        >
          토글
        </button>
        <p>two</p>
        <p>three</p>
      </div>
    </LearnSection>
  )
}

function Demo() {
  useEffect(() => {
    const pElements = document.querySelectorAll('.paragraphes')
    console.log(pElements)
  })

  const articleRef = useRef(null)
  const divRef = useRef(null)

  useEffect(() => {
    console.log(articleRef.current)
    console.log(divRef.current)
  })

  return (
    <article ref={articleRef}>
      <h2>아티클</h2>
      <div ref={divRef} className="paragraphes"></div>
      <p>hello</p>
      <p>World</p>
      <p>welcome</p>
    </article>
  )
}
