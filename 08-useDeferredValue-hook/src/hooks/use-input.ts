import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Timeout } from '@/@types/global'

/**
 * @example
 * // 기본 문자열 입력 관리
 * const input = useInput('')
 * <input value={input.value} onChange={input.onChange} />
 *
 * @example
 * // 숫자 입력 관리
 * const input = useInput(0, { parser: v => Number(v) })
 * <input value={input.value} onChange={input.onChange} type="number" />
 *
 * @example
 * // JSON 파싱 예시
 * const input = useInput({}, {
 *   parser: v => { try { return JSON.parse(v) } catch { return {} } }
 * })
 * <input value={JSON.stringify(input.value)} onChange={input.onChange} />
 *
 * @example
 * // 값 변경 시 콜백 실행
 * const input = useInput('', {
 *   onChange: (val, e) => console.log('입력값:', val)
 * })
 * <input value={input.value} onChange={input.onChange} />
 *
 * @example
 * // 디바운스 적용 (500ms)
 * const input = useInput('', { debounceTime: 500 })
 * <input value={input.defaultValue} onChange={input.onChange} />
 */
export default function useInput<T>(
  initialValue: T,
  options?: {
    parser?: (value: string) => T
    onChange?: (value: T, e: ChangeEvent<HTMLInputElement>) => void
    debounceTime?: number
  }
): {
  value?: T
  defaultValue?: T
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
} {
  const parser = useMemo(
    () => options?.parser ?? ((v: string) => v),
    [options?.parser]
  )

  const changedCallback = options?.onChange

  const [value, setValue] = useState<T>(initialValue)

  const debouceTime = options?.debounceTime ?? 0
  const timerRef = useRef<Timeout | null>(null)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const parsed = parser(e.target.value)

      if (debouceTime > 0) {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setValue(parsed as T)
          changedCallback?.(parsed as T, e)
        }, debouceTime)
      } else {
        setValue(parsed as T)
        changedCallback?.(parsed as T, e)
      }
    },
    [parser, debouceTime, changedCallback]
  )

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // 컴포넌트 unmount 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return {
    [debouceTime > 0 ? 'defaultValue' : 'value']: value,
    onChange: handleChange,
  }
}
