import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { XCircle } from 'lucide-react'
import { tw } from '@/utils'
import { tabbableSelector } from '@/utils/tabbable'
import './_native-modal-dialog.css'
import { type NativeDialogProps } from './types'

export default function NativeModalDialog({
  open = false,
  onClose,
  children,
}: NativeDialogProps) {
  // 모달을 렌더링할 포탈 DOM 가져오기
  const dialogPortal = document.getElementById('modal-portal')

  // dialog DOM 참조
  const dialogRef = useRef<HTMLDialogElement>(null)

  // 마지막 활성화된 엘리먼트 저장 (포커스 복원을 위해)
  const opennerRef = useRef<HTMLElement>(null)

  // 모달 열림/닫힘에 따른 showModal/close 및 애니메이션 제어
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  // 키보드 접근성 및 포커스 트랩 처리
  useEffect(() => {
    const body = document.body
    const dialog = dialogRef.current

    if (!open || !dialog) return

    // 마지막 활성화 엘리먼트 저장 (닫힐 때 포커스 복원)
    opennerRef.current = document.activeElement as HTMLElement

    // dialog 내 탭 이동 가능한 요소들
    const tabbables = [...dialog.querySelectorAll(tabbableSelector)]

    // 첫 번째 탭 요소로 포커스 이동
    const focusingFirstTabbable = () => {
      if (tabbables.length > 0) {
        const firstTabbable = tabbables.at(0) as HTMLElement
        firstTabbable.focus()
      }
    }

    // 키보드 이벤트 핸들러 (Escape, Tab)
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const { key, shiftKey } = e

      if (key === 'Escape') {
        e.preventDefault()
        return onClose?.()
      }

      // Tab / Shift+Tab으로 포커스 순환
      if (key === 'Tab' && tabbables.length > 0) {
        const active = document.activeElement
        const firstTabbable = tabbables.at(0) as HTMLElement
        const lastTabbable = tabbables.at(-1) as HTMLElement

        if (shiftKey && active === firstTabbable) {
          e.preventDefault()
          lastTabbable.focus()
        } else if (!shiftKey && active === lastTabbable) {
          e.preventDefault()
          firstTabbable.focus()
        }
      }
    }

    // dialog의 바깥 영역(딤)을 클릭하면 onClose 호출
    const handleCloseDim = (e: globalThis.MouseEvent) => {
      if (e.target === dialog) {
        onClose?.()
      }
    }

    // 모달 다이얼로그 열 때: 이벤트 리스너 추가, 스크롤 잠금, 초점 이동
    dialog.addEventListener('keydown', handleKeyDown)
    dialog.addEventListener('mouseup', handleCloseDim) // 딤(배경) 클릭 시, 모달 다이얼로그 닫기 처리
    body.style.overflowY = 'hidden'
    focusingFirstTabbable()

    // 모달 다이얼로그 닫을 때: 이벤트 리스너 제거, 스크롤 복원, 포커스 복원
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      dialog.removeEventListener('mouseup', handleCloseDim)
      setTimeout(() => (body.style.overflowY = 'scroll'), 250)
      if (opennerRef.current) opennerRef.current.focus()
    }
  }, [open, onClose])

  // 포탈 DOM 없으면 렌더링하지 않음
  if (!dialogPortal) return null

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-modal
      className={tw(
        'relative',
        'overflow-visible', // 내부 요소가 넘칠 때 잘림 방지
        'border-0 p-5 rounded-md shadow-xl bg-white' // 모달 스타일
      )}
    >
      {children}

      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className={tw(
          'absolute -top-3 -right-3 cursor-pointer p-0.5 bg-white rounded-full border-0 size-7',
          'shadow-xl transition-transform hover:scale-110 active:scale-95'
        )}
      >
        <XCircle />
      </button>
    </dialog>,
    dialogPortal
  )
}
