import type { PropsWithChildren } from 'react'
import S from './status.module.css'

export default function Status({ children }: PropsWithChildren) {
  return (
    <h2 className={S.Status} role="status">
      {children}
    </h2>
  )
}
