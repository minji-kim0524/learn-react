import { LearnSection } from '@/components'
import RandomCountUp from '@/demo'

export default function App() {
  return (
    <LearnSection title="랜덤 카운트 업">
      <RandomCountUp />
    </LearnSection>
  )
}

// ----------------------------------------------------

const highCostList = Array(5e7)
  .fill(null)
  .map((_, i) => ({ key: i + 1 }))

function MemoizedDemo() {
  const [divideValue, setDivideValue] = useState<number>(1)
  
  console.time('리스트 필터링')
  const filter
  }