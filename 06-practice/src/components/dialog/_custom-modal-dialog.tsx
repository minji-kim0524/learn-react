import { type MouseEvent, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { XCircle } from 'lucide-react'
import { useAnimate } from '@/hooks'
import { tw } from '@/utils'
import { getTabbableElements } from '@/utils/tabbable'
import type { CustomDialogProps } from './types'

export default function CustomModalDialog({
  open = false,
  onClose,
  children,
}: CustomDialogProps) {
  const dialogPortal = document.getElementById('modal-portal')
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastActiveElementRef = useRef<HTMLElement>(null)
  const animationDuration = 250
  const animating = useAnimate(open, animationDuration)
  const openAndIsntAnimating = open && !animating

  useEffect(() => {
    if (!open) return

    lastActiveElementRef.current = document.activeElement as HTMLElement
    const tabbables = getTabbableElements(dialogRef.current!)

    const focusingFirstTabbable = () => {
      if (tabbables.length > 0) {
        const first = tabbables.at(0) as HTMLElement
        first.focus()
      }
    }

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') return onClose?.()

      if (e.key === 'Tab' && tabbables.length > 0) {
        const active = document.activeElement
        const firstTabbable = tabbables.at(0) as HTMLElement
        const lastTabbable = tabbables.at(-1) as HTMLElement

        if (e.shiftKey && active === firstTabbable) {
          e.preventDefault()
          lastTabbable.focus()
        } else if (!e.shiftKey && active === lastTabbable) {
          e.preventDefault()
          firstTabbable.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflowY = 'hidden'
    setTimeout(focusingFirstTabbable, 0)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      const lastActiveElement = lastActiveElementRef.current
      if (lastActiveElement) lastActiveElement.focus()
      setTimeout(
        () => (document.body.style.overflowY = 'scroll'),
        animationDuration
      )
    }
  }, [open, onClose])

  if (!dialogPortal) return null

  // 애니메이션 클래스
  const backdropClass = tw(
    'fixed inset-0 flex justify-center items-center',
    'bg-black/10 backdrop-blur-xs',
    'transition-all duration-250',
    openAndIsntAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
  )

  const modalClass = tw(
    'relative bg-white p-5 rounded-md shadow-xl transition-all duration-250',
    openAndIsntAnimating
      ? 'opacity-100 scale-100 translate-y-0'
      : 'opacity-0 scale-95 translate-y-4'
  )

  const handleClickCloseDialog = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) onClose?.()
  }

  return createPortal(
    <div
      role="presentation"
      onClick={handleClickCloseDialog}
      className={backdropClass}
      style={{ transitionProperty: 'opacity, filter' }}
    >
      <div ref={dialogRef} role="dialog" aria-modal className={modalClass}>
        {children}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className={tw(
            'absolute -top-3 -right-3 cursor-pointer p-0.5 bg-white rounded-full border-0 size-7',
            'shadow-xl'
          )}
        >
          <XCircle />
        </button>
      </div>
    </div>,
    dialogPortal
  )
}
