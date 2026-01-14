import {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
} from 'react'
import { X } from 'lucide-react'

type DialogProps = PropsWithChildren<{
  open?: boolean
  onClose?: () => void
  children?: ReactNode
  image: string
  title: string
  description: string
}>

// export default function Modal({ children }: DialogProps) {
//   return <dialog>{children}</dialog>
// }

export default function Modal({
  open,
  image,
  title,
  description,
  onClose,
}: DialogProps) {
  // dialog DOM 참조
  const dialogRef = useRef<HTMLDialogElement>(null)

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

  return (
    <dialog
      ref={dialogRef}
      className="mx-auto my-auto border-0 pt-8 rounded-xl shadow-xl bg-white"
    >
      <button
        type="button"
        className="flex bg-transparent border-0 cursor-pointer justify-end"
        onClick={onClose}
      >
        <X />
      </button>
      <div className="flex flex-row gap-4 w-100 h-50">
        <img src={image} alt={title} className="w-20 h-20" />
        <p className="flex flex-col">
          <span>{title}</span>
          <span>{description}</span>
        </p>
      </div>
    </dialog>
  )
}
