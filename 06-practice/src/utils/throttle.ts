/* eslint-disable @typescript-eslint/no-explicit-any */
export default function throttle<T extends (...args: any[]) => any>(
  callback: T,
  timeout = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>): void => {
    if (!timer) {
      timer = setTimeout(() => {
        callback.apply(null, [...args])
        timer = null
      }, timeout)
    }
  }
}
