import { useEffect, useRef, useState } from 'react'

/**
 * useOpenAnimating
 *
 * 모달 다이얼로그 등 컴포넌트의 열림/닫힘 트랜지션 애니메이션 상태를 관리하는 커스텀 훅입니다.
 *
 * @example
 * // 모달 컴포넌트에서 사용 예시
 * const { isAnimating, openFinished } = useOpenAnimating(isOpen, 400);
 *
 * // isAnimating이 true일 때: 애니메이션 진행 중인 상태
 * // openFinished가 true일 때: 열린 상태 및 애니메이션 종료 상태
 */
export default function useOpenAnimating(
  open: boolean,
  duration: number = 300
) {
  // 모달 다이얼로그가 화면에 보이는지 여부
  const [visible, setVisible] = useState(open)
  // 애니메이션이 진행 중인지 여부
  const [isAnimating, setIsAnimating] = useState(false)
  // setTimeout의 타이머 ID를 저장
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // 애니메이션 부수 효과
  useEffect(() => {
    // 모달 다이얼로그가 열릴 때
    if (open) {
      // 모달 다이얼로그를 표시 상태로 변경
      setVisible(true)
      // 애니메이션 진행중인 상태로 변경
      setIsAnimating(true)

      // 애니메이션이 종료되면
      timerRef.current = setTimeout(() => {
        // 애니메이션 진행 종료 상태로 변경
        setIsAnimating(false)
      }, duration)
    }
    // 모달 다이얼로그가 닫힐 때
    // visible 값이 true인 경우만 애니메이션 적용
    else if (visible) {
      // 애니메이션 진행중인 상태로 변경
      setIsAnimating(true)
      // 애니메이션이 종료되면
      timerRef.current = setTimeout(() => {
        // 애니메이션 진행 종료 상태로 변경
        setIsAnimating(false)
        // 모달 다이얼로그 감춤 상태로 변경
        setVisible(false)
      }, duration)
    }

    // 정리(cleanup)
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [open, duration, visible])

  return {
    isAnimating,
    openFinished: visible && !isAnimating,
  }
}
