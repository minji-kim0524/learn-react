import { useEffect, useRef, useState } from 'react'
import Logo from './logo'
import Output from './output'
import Shortcut from './shortcut'
import { getRandomCount, setAppColor, setDocumentTitle } from './utils'
import './app.css'

const MIN = 50
const MAX = 90
const getTargetCount = () => getRandomCount(MIN, MAX)

export default function RandomCountUp() {
  // ------------------------------------------------------------
  // 목표 카운트 설정 및 문서 제목 변경 동기화

  const [targetCount, setTargetCount] = useState(getTargetCount)
  useEffect(() => {
    setDocumentTitle(targetCount)
    setAppColor()
  }, [targetCount])

  // ------------------------------------------------------------
  // 카운트 애니메이션

  const [count, setCount] = useState(0)
  const animateRef = useRef(0)

  useEffect(() => {
    animateRef.current = requestAnimationFrame(() => {
      if (count < targetCount) {
        setCount((c) => c + 1)
      }
    })

    return () => {
      cancelAnimationFrame(animateRef.current)
    }
  }, [count, targetCount])

  // ------------------------------------------------------------
  // 리플레이

  const [replay, setReplay] = useState(0)

  useEffect(() => {
    const handleReplay = () => {
      setCount(0)
      setTargetCount(getTargetCount())
      setReplay((r) => r + 1)
    }

    const handleShortcut = (e) => {
      if (e.shiftKey && e.code === 'Enter') handleReplay()
    }

    document.addEventListener('click', handleReplay)
    document.addEventListener('keydown', handleShortcut)

    return () => {
      document.removeEventListener('click', handleReplay)
      document.removeEventListener('keydown', handleShortcut)
    }
  }, [])

  return (
    <div className="randomCountUpApp">
      <Logo />
      <Output key={replay} count={count} targetCount={targetCount} />
      <Shortcut />
    </div>
  )
}
