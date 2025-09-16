import { useCallback, useEffect, useState } from 'react'

/**
 * 토글 상태를 관리하는 커스텀 훅입니다.
 *
 * @example
 * // 기본 사용법
 * const [isToggle, { on, off, toggle, set }] = useToggleState()
 *
 * // 토글 상태 확인
 * console.log(isToggle) // true 또는 false
 *
 * // 상태 켜기
 * on()
 *
 * // 상태 끄기
 * off()
 *
 * // 상태 전환
 * toggle()
 *
 * // 직접 값 설정
 * set(false)
 *
 * @example
 * // 초기값을 false로 설정
 * const [isToggle, controls] = useToggleState(false)
 */
export default function useToggleState(initialValue: boolean = true) {
  const [isToggle, setIsToggle] = useState<boolean>(initialValue)

  const on = useCallback(() => setIsToggle(true), [])
  const off = useCallback(() => setIsToggle(false), [])
  const toggle = useCallback(() => setIsToggle((t) => !t), [])

  useEffect(() => {
    // 초깃값(initialValue) 변경 시, 상태 동기화
    setIsToggle(initialValue)
  }, [initialValue])

  return [isToggle, { on, off, toggle, set: setIsToggle }] as const
}
