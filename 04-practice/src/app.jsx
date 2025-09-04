import { useEffect, useState } from 'react'
import { LearnSection } from '@/components'

export default function App() {
  console.log('App 렌더링')

  const [key, setKey] = useState(0)

  // 데이터 가져오기 상태관리
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch('https://jsonplaceholder.typicode.com/albums/1')
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData)

        setLoading(false)
      })
      .catch((error) => {
        setError(error)

        setLoading(false)
      })
  }, [])

  console.log({ loading, error, data })

  return (
    <LearnSection title="데이터 가져오기(fetching data)" showTitle>
      <p>{'앨범이름'}</p>
      <div role="group" className="mt-5">
        <button
          type="button"
          className="button"
          onClick={() => setKey((k) => k + 1)}
        >
          렌더링 키 변경
        </button>
        <output>렌더링 키: {key}</output>
      </div>
    </LearnSection>
  )
}
