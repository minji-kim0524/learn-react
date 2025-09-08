/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timeout } from '@/@types/global'

export default function debounce<T extends (...args: any[]) => void>(
  callback: T,
  timeout: number = 300
): (...args: Parameters<T>) => void {
  let cleanup: undefined | Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(cleanup)
    cleanup = setTimeout(callback.bind(null, ...args), timeout)
  }
}
