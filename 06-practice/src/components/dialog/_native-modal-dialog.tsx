import { type MouseEvent, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { XCircle } from 'lucide-react'
import { useAnimate } from '@/hooks'
import { tw } from '@/utils'
import { getTabbableElements } from '@/utils/tabbable'
import { type NativeDialogProps } from './types'

export default function NativeModalDialog({
  open = false,
  onClose,
  children,
}: NativeDialogProps) {
  const dialogPortal = document.getElementById('modal-portal')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lastActiveElementRef = useRef<HTMLElement>(null)
  const animationDuration = 250
  const animating = useAnimate(open, animationDuration)
  const openAndIsntAnimating = open && !animating

  useEffect(() => {
    const dialog = dialogRef.current

    if (open) {
      dialog?.showModal()
    } else {
      dialog?.close()
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    lastActiveElementRef.current = document.activeElement as HTMLElement
    const tabbables = getTabbableElements(dialogRef.current!)

    const focusingFirstTabbable = () => {
      if (tabbables.length > 0) {
        const firstTabbable = tabbables.at(0) as HTMLElement
        firstTabbable.focus()
      }
    }

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const { key, shiftKey } = e
      if (key === 'Escape') return onClose?.()

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

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflowY = 'hidden'
    setTimeout(focusingFirstTabbable, 0)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      setTimeout(
        () => (document.body.style.overflowY = 'scroll'),
        animationDuration
      )
      if (lastActiveElementRef.current) lastActiveElementRef.current.focus()
    }
  }, [open, onClose])

  if (!dialogPortal) return null

  // 애니메이션 클래스
  const backdropClass = tw(
    'flex justify-center items-center border-0 bg-transparent py-8 backdrop:bg-black/10 backdrop:backdrop-blur-xs',
    'transition-all duration-250',
    openAndIsntAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
  )

  const dialogClass = tw(
    'overflow-visible',
    'relative',
    'border-0 p-5 rounded-md shadow-xl bg-white',
    'transition-all duration-250',
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
      className={backdropClass}
      style={{ transitionProperty: 'opacity, filter' }}
      onClick={handleClickCloseDialog}
    >
      <dialog ref={dialogRef} aria-modal className={dialogClass}>
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
      </dialog>
    </div>,
    dialogPortal
  )
}
