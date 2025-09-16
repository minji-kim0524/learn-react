import type { ComponentProps, PropsWithChildren } from 'react'

export type CommonProps = PropsWithChildren<{
  open?: boolean
  onClose?: () => void
}>

export type NativeDialogProps = ComponentProps<'dialog'> & CommonProps

export type CustomDialogProps = ComponentProps<'div'> & CommonProps
