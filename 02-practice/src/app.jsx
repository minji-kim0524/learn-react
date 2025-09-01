import { Component, useEffect, useState } from 'react'
import { LearnSection } from '@/components'

export default function App() {
  console.log('렌더링')

  return (
    <LearnSection
      title="함수 값 참조"
      className="bg-slate-950 h-screen flex flex-col gap-4"
    >
      <MemoPrevStateValue />
      <FunctionalComponent />
    </LearnSection>
  )
}
function useRef(initialValue) {
  const [ref] = useState({ current: initialValue })
  return ref
}

// 이전 상태값 기억
function MemoPrevStateValue() {
  console.log('메모리')
  const [count, setCount] = useState(0)
  const prevCountRef = useRef(undefined)

  // useEffect(() => {
  //   prevCountRef.current = count
  // }, [count])

  return (
    <div className="bg-white text-blue-950 p-10 text-2xl">
      <p>현재 상태 값: {count}</p>
      <p>
        이전 상태 값: {prevCountRef.current ?? 'undefined'} (참조 객체의 current
        값)
      </p>
      <button
        type="button"
        className="button"
        onClick={() => {
          const nextCount = count + 1
          setCount(nextCount) // 다음 렌더링 시점의 상태 값
          prevCountRef.current = count
        }}
      >
        count 증가
      </button>
      <button
        type="button"
        className="button"
        onClick={() => {
          prevCountRef.current += 1
          console.log(prevCountRef.current)
        }}
      >
        prevCount 증가
      </button>
    </div>
  )
}

function FunctionalComponent() {
  // 지역변수: 렌더링될 때마다 초기화 -> 값 기억 ❌
  console.log('리렌더링 시작')

  // useRef 리액트 훅을 이용하여 값 참조(기억) ✅
  const messageRef = useRef('HELLO 리액트!')
  console.log(messageRef.current)

  const handleUpdateValue = () => {
    messageRef.current += '🍀'
    // console.log(messageRef.current)
  }

  const handleResetRefValue = () => {
    messageRef.current = 'HELLO 리액트!'
    console.log('messageRef 현재 참조값 초기화')
  }

  const [count, setCount] = useState(1)

  const handleUpdateState = () => {
    setCount(count + 1)
  }

  return (
    <section className="p-5 bg-yellow-300 text-black">
      <h2 className="font-extrabold text-x1 mb-2">
        클래스 컴포넌트에서의 값 참조
      </h2>
      <p>컴포넌트 렌더링될 때마다 이전의 값을 기억할 수 있다</p>
      <p>렌더링을 유발하지 않는 값을 기억하는 방법 - 인스턴스 멤버 사용</p>
      <button
        type="button"
        className="button block my-2"
        onMouseEnter={handleUpdateValue}
        onClick={handleUpdateState}
        onDoubleClick={handleResetRefValue}
      >
        메시지 변경 ({count})
      </button>
    </section>
  )
}
