/**
 * 함수 실행 시간을 측정하고 로그로 출력합니다.
 * @example
 * await measureTime('데이터 로딩', async () => {
 *   await fetchData()
 * })
 * // 출력: "데이터 로딩 : 123ms"
 */
export default async function measureTime(
  label: string,
  callback: () => Promise<void>
) {
  const startTime = Date.now()
  await callback()
  const endTime = Date.now()
  console.log(`${label} : ${endTime - startTime}ms`)
}
