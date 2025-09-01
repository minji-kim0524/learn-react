/**
 * 함수 실행 시간을 측정하고 로그로 출력합니다.
 *
 * @param {string} label - 측정 작업을 식별하기 위한 레이블
 * @param {Function} callback - 실행 시간을 측정할 비동기 콜백 함수
 *
 * @example
 * // 기본 사용법
 * await measureTime('데이터 로딩', async () => {
 *   await fetchData()
 * })
 * // 출력: "데이터 로딩 : 123ms"
 */
export default async function measureTime(label, callback) {
  const startTime = Date.now()
  await callback?.()
  const endTime = Date.now()
  console.log(`${label} : ${endTime - startTime}ms`)
}
