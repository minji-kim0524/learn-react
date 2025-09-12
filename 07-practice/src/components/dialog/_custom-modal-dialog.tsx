import { type MouseEvent, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { XCircle } from 'lucide-react'
import { useOpenAnimating } from '@/hooks'
import { tw } from '@/utils'
import { tabbableSelector } from '@/utils/tabbable'
import type { CustomDialogProps } from './types'

export default function CustomModalDialog({
  open = false,
  onClose,
  children,
}: CustomDialogProps) {
  // 모달 다이얼로그가 렌더링될 포탈 DOM 요소
  const dialogPortal = document.getElementById('modal-portal')

  // 다이얼로그 딤(배경) 영역 참조
  const dialogDimRef = useRef<HTMLDivElement>(null)

  // 다이얼로그 참조
  const dialogRef = useRef<HTMLDivElement>(null)

  // 다이얼로그를 연 요소 기억
  const opennerRef = useRef<HTMLElement>(null)

  // 애니메이션 지속 시간(ms)
  const animationDuration = 250

  // open 상태 변화에 따라 애니메이션 중인지 여부 반환
  const { openFinished } = useOpenAnimating(open, animationDuration)

  // 모달 열림/닫힘 시, 초점 및 키보드 이벤트 처리
  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return

    // 현재 활성화된 엘리먼트 저장 (모달 닫힐 때, 초저 복원)
    opennerRef.current = document.activeElement as HTMLElement

    // 모달 내부의 탭 이동 가능한(tabbable) 요소 목록
    const tabbables = [...dialog.querySelectorAll(tabbableSelector)]

    // 첫 번째 탭 이동 가능한 요소에 초점 이동
    const focusingFirstTabbable = () => {
      if (tabbables.length > 0) {
        const first = tabbables.at(0) as HTMLElement
        first.focus()
      }
    }

    // 키보드 이벤트 핸들링
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // ESC 키 누르면 모달 다이얼로그 닫기
      if (e.key === 'Escape') return onClose?.()

      // Tab 키로 초점 순환 제어 (모달 다이얼로그 안에서만 초점 이동)
      if (e.key === 'Tab' && tabbables.length > 0) {
        const active = document.activeElement
        const firstTabbable = tabbables.at(0) as HTMLElement
        const lastTabbable = tabbables.at(-1) as HTMLElement

        // Shift + Tab: 첫 번째에서 마지막으로 순환
        if (e.shiftKey && active === firstTabbable) {
          e.preventDefault()
          lastTabbable.focus()
        }
        // Tab: 마지막에서 첫 번째로 순환
        else if (!e.shiftKey && active === lastTabbable) {
          e.preventDefault()
          firstTabbable.focus()
        }
      }
    }

    // 키보드 이벤트 등록
    document.addEventListener('keydown', handleKeyDown)
    // 모달 열릴 때 스크롤 방지
    document.body.style.overflowY = 'hidden'
    // 첫 번째 탭 이동 가능한 엘리먼트에 포커스
    focusingFirstTabbable()

    // 클린업: 이벤트 제거, 포커스 복원, 스크롤 해제(애니메이션 끝난 뒤)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      const lastActiveElement = opennerRef.current
      if (lastActiveElement) lastActiveElement.focus()
      setTimeout(
        () => (document.body.style.overflowY = 'scroll'),
        animationDuration
      )
    }
  }, [open, onClose])

  // 딤 영역 클릭 시, 모달 다이얼로그 닫기
  const handleClickCloseDialog = (e: MouseEvent<HTMLDivElement>) => {
    if (dialogDimRef.current === e.target) onClose?.()
  }

  // 포탈 DOM이 없으면 렌더링하지 않음
  if (!dialogPortal) return null

  return createPortal(
    <div
      role="presentation"
      ref={dialogDimRef}
      onClick={handleClickCloseDialog}
      className={tw(
        'fixed inset-0 flex justify-center items-center',
        'bg-black/10 backdrop-blur-[2px]',
        'transition-all duration-250',
        openFinished ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      style={{ transitionProperty: 'opacity, filter' }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal
        className={tw(
          'relative bg-white p-5 rounded-md shadow-xl',
          'transition-all duration-250',
          openFinished
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
        )}
      >
        {children}
        <button
          type="button"
          onClick={onClose}
          aria-label="다이얼로그 닫기"
          title="다이얼로그 닫기"
          className={tw(
            'absolute -top-3 -right-3 cursor-pointer p-0.5 bg-white rounded-full border-0 size-7',
            'shadow-xl transition-transform hover:scale-110 active:scale-95'
          )}
        >
          <XCircle />
        </button>
      </div>
    </div>,
    dialogPortal
  )
}
