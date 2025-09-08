import { useEffect, useState } from 'react'

/**
 * 요소의 등장/사라짐 애니메이션을 위한 커스텀 훅
 *
 * @example
 * const isAnimating = useAnimate(open, 300);
 *
 * return (
 *   <>
 *     {open && (
 *       <div
 *         role="dialog"
 *         aria-modal
 *         className={tw('modal', isAnimating && 'animating')}
 *       >
 *         모달 다이얼로그 콘텐츠
 *       </div>
 *     )}
 *   </>
 * )
 */
export default function useAnimate(
  open: boolean = false,
  duration: number = 250
) {
  // 실제로 모달이 DOM에 있을지 결정하는 역할
  // 애니메이션이 끝나고 나서야 DOM에서 완전히 제거
  const [visible, setVisible] = useState<boolean>(open)

  // 등장/퇴장 애니메이션 효과를 주기 위한 상태
  // 모달이 열릴 때/닫힐 때 각각 애니메이션을 트리거
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

  // 작동 흐름
  // open → true:
  // visible true → 모달 등장 → 애니메이션 실행
  //
  // open → false:
  // animating true → 사라지는 애니메이션 실행
  // 애니메이션 끝나면 visible false → DOM에서 제거

  // open 상태 변화에 따라 visible 상태 관리
  useEffect(() => {
    if (open) {
      setVisible(true)
      setIsAnimating(true)
      // 모달이 열릴 때는 10ms 후에 animating을 false로 바꿔야
      // CSS transition이 제대로 적용됨 (브라우저 렌더링 트리거)
      setTimeout(() => setIsAnimating(false), 10)
    } else if (visible) {
      setIsAnimating(true)
      // 모달이 닫힐 때는 애니메이션이 끝날 때까지 기다렸다가
      // DOM에서 제거해야 자연스러운 사라짐 효과가 나타남
      setTimeout(() => {
        setVisible(false)
        setIsAnimating(false)
      }, duration)
    }
  }, [open, visible, duration])

  return isAnimating
}
