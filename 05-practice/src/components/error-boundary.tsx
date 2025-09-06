import type { ReactElement, ReactNode } from 'react'
import {
  FallbackProps,
  ErrorBoundary as ReactErrorBoundary,
} from 'react-error-boundary'

interface ErrorBoundaryProps {
  children: ReactNode
  fallbackRender?: (props: FallbackProps) => ReactElement
}

export default function ErrorBoundary({
  children,
  fallbackRender,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      fallbackRender={fallbackRender ?? defaultFallbackErrorUI}
    >
      {children}
    </ReactErrorBoundary>
  )
}

function defaultFallbackErrorUI({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <section role="alert">
      <h2 className="text-3xl">오류 발생!</h2>
      <pre className="text-red-500 font-semibold">{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        오류 복구
      </button>
    </section>
  )
}
