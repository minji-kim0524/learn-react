/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from 'react'
import { type Draft } from 'immer'
import { useImmer } from 'use-immer'
import { State } from '@/@types/global'

const init = <T>(initialData: T | null = null): State<T> => ({
  status: 'idle',
  error: null,
  data: initialData,
})

/**
 * fetch API 기반의 비동기 데이터 조회를 위한 커스텀 훅입니다.
 *
 * 상태 관리, 에러 처리, 로딩 상태, 재조회(refetch), 초기화(reset)를 지원합니다.
 *
 * @template T 응답 데이터의 타입
 *
 * @example
 * // 기본 사용법
 * const { data, isLoading, hasError, error } = useQuery<User[]>('/api/users')
 *
 * @example
 * // 초기값 및 fetch 옵션 지정
 * const { data, refetch, reset } = useQuery<User>('/api/user/1', {
 *   method: 'GET',
 *   headers: { Authorization: 'Bearer ...' },
 * }, null)
 *
 * @example
 * // refetch로 수동 재조회
 * refetch()
 *
 * @example
 * // reset으로 상태 초기화
 * reset()
 */
export default function useQuery<T = unknown>(
  url: string,
  options?: RequestInit,
  initialData: T | null = null
) {
  const [state, setState] = useImmer<State<T>>(init<T>(initialData))
  const abortControllerRef = useRef<AbortController | null>(null)

  const isLoading = state.status === 'pending'
  const hasError = state.status === 'rejected'

  const fetchData = useCallback(
    async (url: string, options?: RequestInit) => {
      setState((draft) => {
        draft.status = 'pending'
        draft.error = null
      })

      try {
        const response = await fetch(url, options)

        let responseData: any

        try {
          responseData = await response.json()
        } catch {
          responseData = null
        }

        if (!response.ok) {
          throw typeof responseData === 'string'
            ? responseData
            : JSON.stringify(responseData)
        }

        setState((draft) => {
          draft.status = 'resolved'
          draft.data = responseData as Draft<T>
        })
      } catch (error: any) {
        if (error.name === 'AbortError') return

        setState((draft) => {
          draft.status = 'rejected'
          draft.error = error?.message || error
        })
      }
    },
    [setState]
  )

  const refetch = useCallback(() => {
    abortControllerRef.current = new AbortController()
    fetchData(url, {
      signal: abortControllerRef.current.signal,
      ...options,
    })
  }, [fetchData, url, options])

  const reset = useCallback(() => {
    setState(init(initialData))
  }, [setState, initialData])

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    fetchData(url, { signal: abortControllerRef.current.signal, ...options })
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [url, options, fetchData])

  return { ...state, isLoading, hasError, refetch, reset } as const
}
