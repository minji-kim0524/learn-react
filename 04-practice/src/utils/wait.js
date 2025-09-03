/**
 * 지정된 지연 시간 후에 해결되는 Promise를 생성합니다.
 *
 * @param {number} [delay=1] - Promise가 해결되기 전 지연 시간(초)
 * @returns {Promise<void>} 지정된 지연 시간 후에 해결되는 Promise
 *
 * @example
 * // 기본값인 1초 동안 대기
 * await wait()
 *
 * @example
 * // 2초 동안 대기
 * await wait(2)
 */
export default function wait(delay = 1) {
  return new Promise((resolve) => setTimeout(resolve, delay * 1000))
}
