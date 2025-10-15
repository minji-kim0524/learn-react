// import { LearnSection, RandomCountUp } from '@/components'
// export default function App() {
//   return (
//     <LearnSection title="랜덤 카운트 업">
//       <RandomCountUp />
//     </LearnSection>
//   )
// }
import { type ComponentProps, useState } from 'react'

export default function App() {
  const [query, setQuery] = useState('')

  function SlowChild({ query }: { query: string }) {
    const start = performance.now()

    while (performance.now() - start < 100) {
      // 성능지연
    }
    return <p>검색어: {query}</p>
  }

  return (
    <div className="app">
      <label htmlFor="search-input">검색어 입력</label>
      <input
        id="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <SlowChild query={query} />
    </div>
  )
}
