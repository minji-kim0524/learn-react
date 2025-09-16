import CustomModalDialog from './_custom-modal-dialog'
import NativeDialogModal from './_native-modal-dialog'
import { type CommonProps } from './types'

type Mode = 'native' | 'custom'
type DialogProps = CommonProps & { mode?: Mode }

export default function Dialog({
  open,
  onClose,
  children,
  mode = 'native',
}: DialogProps) {
  return mode === 'native' ? (
    <NativeDialogModal open={open} onClose={onClose}>
      {children}
    </NativeDialogModal>
  ) : (
    <CustomModalDialog open={open} onClose={onClose}>
      {children}
    </CustomModalDialog>
  )
}
