import { useEffect, useState } from 'react'
import { LearnSection } from '@/components'
import { wait } from './utils'

const API_URL = 'https://jsonplaceholder.typicode.com/albums/100'

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

    fetch(API_URL)
      .then(async (response) => {
        await wait(2)

        if (response.ok) {
          return response.json()
        }

        if (response.status === 404) {
          throw new Error('응답 데이터를 찾을 수 없습니다.')
        }
      })
      .then((responseData) => {
        setData(responseData)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [key])

  console.log({ loading, error, data })

  let renderElement = null

  if (loading) {
    renderElement = (
      <p
        role="status"
        aria-live="polite"
        className="text-indigo-300 font-semibold text 2x1"
      >
        로딩 중...
      </p>
    )
  } else if (error) {
    renderElement = (
      <p
        role="alert"
        aria-live="assertive"
        className="text-red-600 font-semibold text-2x1"
      >
        오류 발생!! {error.message}
      </p>
    )
  } else {
    renderElement = (
      <p>
        앨범 타이틀: {data?.id ?? 0} | {data?.title ?? 'Album Title'}
      </p>
    )
  }

  return (
    <LearnSection title="데이터 가져오기(fetching data)" showTitle>
      {renderElement}
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
