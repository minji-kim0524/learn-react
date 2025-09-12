import { useCallback } from 'react'
import type { Draft } from 'immer'
import { useImmer } from 'use-immer'
import { type State } from '@/@types/global'

interface Options<T> {
  autoReset?: boolean
  autoResetDelay?: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface Config<A, T> extends Options<T> {
  mutateFn: (args: A) => Promise<Response>
}

const INITIAL_STATE = <T>(): State<T> => ({
  status: 'idle',
  error: null,
  data: null,
})

/**
 * 비동기 mutation 요청과 상태 관리를 위한 커스텀 훅입니다.
 *
 * @template A 요청 파라미터 타입
 * @template T 응답 데이터 타입
 *
 * @example
 * // POST 요청 예시
 * const { mutate, isLoading, isSuccess, hasError, data, error, reset } = useMutation({
 *   mutateFn: (body) => fetch('/api/todo', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(body)
 *   }),
 *   onSuccess: (data) => console.log('성공!', data),
 *   onError: (err) => alert(err.message),
 *   autoReset: true, // 성공/실패 후 상태 자동 초기화
 *   autoResetDelay: 2000, // 2초 후 초기화
 * })
 *
 * // 사용 예시
 * mutate({ title: '새 할 일' })
 *
 * @example
 * // GET 요청 예시 (파라미터 없이)
 * const { mutate, data } = useMutation({
 *   mutateFn: () => fetch('/api/user'),
 * })
 *
 * useEffect(() => {
 *   mutate()
 * }, [])
 */
export default function useMutation<A = unknown, T = unknown>({
  mutateFn,
  autoReset = false,
  autoResetDelay = 1500,
  onSuccess,
  onError,
}: Config<A, T>) {
  const [state, setState] = useImmer<State<T>>(INITIAL_STATE<T>())

  const isLoading = state.status === 'pending'
  const hasError = state.status === 'rejected'
  const isSuccess = state.status === 'resolved'

  const mutate = useCallback(
    async (args: A) => {
      setState((draft) => {
        draft.status = 'pending'
        draft.error = null
      })

      try {
        const response = await mutateFn(args)
        const responseData = await response.json()

        if (!response.ok) {
          // 에러 객체로 변환
          throw new Error(await extractErrorMessage(response))
        }

        setState((draft) => {
          draft.status = 'resolved'
          draft.data = responseData as Draft<T>
        })

        onSuccess?.(responseData as T)

        if (autoReset) {
          setTimeout(() => setState(INITIAL_STATE<T>()), autoResetDelay)
        }

        return responseData as T
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : await extractErrorMessage(error)
        const errorObj = new Error(message)
        setState((draft) => {
          draft.status = 'rejected'
          draft.error = errorObj
        })
        onError?.(errorObj)
        if (autoReset) {
          setTimeout(() => setState(INITIAL_STATE<T>()), autoResetDelay)
        }
        throw errorObj
      }
    },
    [mutateFn, setState, autoReset, autoResetDelay, onSuccess, onError]
  )

  const reset = useCallback(() => setState(INITIAL_STATE<T>()), [setState])

  return { ...state, isLoading, hasError, isSuccess, mutate, reset }
}

const extractErrorMessage = async (error: unknown): Promise<string> => {
  if (error instanceof Response) {
    try {
      const contentType = error.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const json = await error.json()
        return typeof json === 'string'
          ? json
          : json.message || JSON.stringify(json)
      } else {
        return await error.text()
      }
    } catch {
      return error.statusText || 'Unknown Error'
    }
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
