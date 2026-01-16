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
      className="mx-auto my-auto border-0 pt-8 rounded-xl shadow-xl bg-white w-100 h-65 px-4"
    >
      <div className="flex justify-end">
        <button
          type="button"
          className="flex bg-transparent border-0 cursor-pointer"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <div className="flex flex-row items-center gap-7 px-2">
        <img src={image} alt={title} className="w-20" />
        <p className="flex flex-col gap-10 w-full">
          <span className="font-bold text-3xl bg-black border-none rounded-4xl text-white py-2 text-center">
            {title}
          </span>
          <span className="text-[1rem]">
            {description ? description : `Hello, my name is ${title}`}
          </span>
        </p>
      </div>
    </dialog>
  )
}
