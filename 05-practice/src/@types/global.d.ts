export type Timeout = ReturnType<typeof setTimeout> | number | undefined

export type Status = 'idle' | 'pending' | 'resolved' | 'rejected'

export interface State<T> {
  status: Status
  error: null | Error | string
  data: null | T
}
