import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'sonner'
import '@/styles/main.css'
import App from './app'

const root = document.getElementById('root')
if (!root) throw new Error('문서에 #root 요소가 존재하지 않습니다.')

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary fallback="에러가 발생하였습니다.">
      <App />
      <Toaster position="bottom-center" />
    </ErrorBoundary>
  </StrictMode>
)
