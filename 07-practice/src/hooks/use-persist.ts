import { useEffect, useMemo, useRef, useState } from 'react'

type StorageType = 'local' | 'session'

interface PersistOptions<T> {
  storageType?: StorageType // 기본값: 'local'
  expireMs?: number // 만료 시간(ms) (예: 60 * 60 * 1000 = 1시간)
  validate?: (value: unknown) => value is T // 타입 검증 함수
}

interface PersistedData<T> {
  value: T
  expiresAt?: number
}

/**
 * 상태를 localStorage 또는 sessionStorage에 저장하는 커스텀 훅입니다.
 *
 * 만료 및 타입 검증을 옵션으로 지원합니다.
 *
 * @template T 저장할 값의 타입
 *
 * @example
 * // 기본 사용법 (localStorage, 만료 없음)
 * const [value, setValue, remove] = usePersist('my-key', '초기값')
 * setValue('새 값') // 값 변경 및 저장
 * remove() // 저장소에서 삭제 및 초기값으로 리셋
 *
 * @example
 * // 만료 시간 1시간, sessionStorage 사용
 * const [num, setNum] = usePersist('count', 0, {
 *   storageType: 'session',
 *   expireMs: 60 * 60 * 1000,
 * })
 *
 * @example
 * // 타입 검증 함수 포함
 * const isString = (v: unknown): v is string => typeof v === 'string'
 * const [str, setStr] = usePersist('safe-string', '', {
 *   validate: isString,
 * })
 *
 * @example
 * // 객체 타입 저장 및 만료
 * type User = { name: string, age: number }
 * const [user, setUser, removeUser] = usePersist<User>('user', { name: '', age: 0 }, {
 *   expireMs: 10000, // 10초 후 만료
 * })
 */
export default function usePersist<T>(
  key: string,
  initialValue: T,
  options: PersistOptions<T> = {}
) {
  const { storageType = 'local', expireMs, validate } = options

  const storage = useMemo(() => getStorage(storageType), [storageType])

  const [state, setState] = useState<T>(() => {
    if (!storage) return initialValue

    try {
      const raw = storage.getItem(key)

      if (!raw) return initialValue
      const data: PersistedData<T> = JSON.parse(raw)

      // 만료 확인
      if (data.expiresAt && Date.now() > data.expiresAt) {
        storage.removeItem(key)
        return initialValue
      }

      // 타입 검증
      if (validate && !validate(data.value)) return initialValue

      return data.value
    } catch (e) {
      console.error(`저장소에서 ${key} 읽기 실패`, e)

      return initialValue
    }
  })

  // 자동 만료를 위한 expiresAt 계산
  const expiresAtRef = useRef<number | undefined>(
    expireMs ? Date.now() + expireMs : undefined
  )

  // 상태 변경 시 저장
  useEffect(() => {
    if (!storage) return

    try {
      const data: PersistedData<T> = {
        value: state,
        expiresAt: expireMs ? Date.now() + expireMs : undefined,
      }

      storage.setItem(key, JSON.stringify(data))
      expiresAtRef.current = data.expiresAt
    } catch (e) {
      console.error(`저장소에 ${key} 쓰기 실패`, e)
    }
  }, [key, state, storageType, expireMs, storage])

  // 다른 탭(윈도우)에서 변경 시 동기화
  useEffect(() => {
    if (!storage) return

    const handler = (e: StorageEvent) => {
      if (e.key !== key) return

      try {
        if (!e.newValue) {
          setState(initialValue)
          return
        }
        const data: PersistedData<T> = JSON.parse(e.newValue)

        if (data.expiresAt && Date.now() > data.expiresAt) {
          setState(initialValue)
        } else if (!validate || validate(data.value)) {
          setState(data.value)
        }
      } catch {
        setState(initialValue)
      }
    }

    globalThis.addEventListener('storage', handler)

    return () => globalThis.removeEventListener('storage', handler)
  }, [key, initialValue, validate, storageType, storage])

  // 수동 삭제/초기화 함수
  const remove = () => {
    if (!storage) return
    storage.removeItem(key)
    setState(initialValue)
  }

  return [state, setState, remove] as const
}

function getStorage(type: StorageType) {
  if (typeof globalThis === 'undefined') return undefined
  return type === 'local' ? globalThis.localStorage : globalThis.sessionStorage
}
