/**
 * 지정된 지연 시간 후에 해결되는 Promise를 생성합니다.
 *
 * @example
 * // 기본값(1초) 동안 대기
 * await wait()
 * @example
 * // 1.5초 동안 대기
 * await wait(1.5)
 */
export default function wait(delay = 1) {
  return new Promise((resolve) => setTimeout(resolve, delay * 1000))
}
