import { useEffect, useRef } from 'react'

/**
 * 이전 렌더링의 값을 반환하는 커스텀 훅입니다.
 *
 * 값이 변경될 때마다 이전 값을 기억합니다.
 *
 * log 옵션을 true로 설정하면 이전 / 현재 값을 콘솔에 출력합니다.
 *
 * @template T 추적할 값의 타입
 *
 * @example
 * // 기본 사용법
 * const prevCount = usePrev(count)
 * // prevCount에는 이전 렌더의 count 값이 들어갑니다.
 *
 * @example
 * // 콘솔 로그 활성화
 * const prevValue = usePrev(value, true)
 *
 * @example
 * // 객체 타입도 추적 가능
 * const prevUser = usePrev(user)
 *
 * @returns 이전 렌더링의 값 (최초에는 undefined)
 */
export default function usePrev<T>(
  value: T,
  log: boolean = false
): T | undefined {
  const prevRef = useRef<T>(undefined)

  useEffect(() => {
    if (log) {
      console.log('이전 값:', prevRef.current)
      console.log('현재 값:', value)
      console.log('이전, 현재 값은 같다. =', Object.is(value, prevRef.current))
    }

    prevRef.current = value
  }, [value, log])

  return prevRef.current
}
