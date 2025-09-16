import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 배열 상태를 편리하게 관리할 수 있는 커스텀 훅입니다.
 *
 * @template T 배열 요소의 타입
 *
 * @example
 * // 숫자 배열 관리 예시
 * const {
 *   array,
 *   push,
 *   remove,
 *   replace,
 *   reset,
 *   clear,
 * } = useArray<number>([1, 2, 3])
 *
 * push(4, 5) // [1, 2, 3, 4, 5]
 * remove(0)  // [2, 3, 4, 5]
 * replace(1, 99) // [2, 99, 4, 5]
 * reset() // [1, 2, 3]
 * clear() // []
 *
 * @example
 * // 객체 배열 관리 예시
 * interface Todo { id: number; text: string }
 * const { array, push, filter } = useArray<Todo>([]);
 * push({ id: 1, text: '할 일' });
 * filter(todo => todo.id !== 1); // id가 1이 아닌 항목만 남김
 */
export default function useArray<T>(initialValue: T[] = []) {
  const [array, setArray] = useState<T[]>(initialValue)
  const arrayRef = useRef<T[]>(initialValue)

  const set = useCallback(
    (next: T[]) => setArray(Array.isArray(next) ? next : []),
    []
  )

  const push = useCallback(
    (...items: T[]) => setArray((array) => [...array, ...items]),
    []
  )

  const unshift = useCallback(
    (...items: T[]) => setArray((array) => [...items, ...array]),
    []
  )

  const replace = useCallback(
    (index: number, item: T) =>
      setArray((array) => array.map((t, i) => (index === i ? item : t))),
    []
  )

  const filter = useCallback(
    (fn: (item: T, index: number, array: T[]) => boolean) =>
      setArray((array) => array.filter(fn)),
    []
  )

  const remove = useCallback(
    (index: number) => setArray((array) => array.filter((_, i) => i !== index)),
    []
  )

  const reset = useCallback(() => setArray(arrayRef.current), [])

  const clear = useCallback(() => setArray([]), [])

  useEffect(() => {
    // 초깃값(initialValue) 변경 시, 참조 객체의 현재값 동기화
    arrayRef.current = initialValue
  }, [initialValue])

  return {
    array,
    set,
    push,
    unshift,
    replace,
    filter,
    remove,
    clear,
    reset,
  }
}
