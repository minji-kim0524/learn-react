export default function navigate<T = string>(page: T) {
  // 브라우저 주소창의 쿼리스트링을 변경
  const url = new URL(window.location.href)
  url.searchParams.set('page', String(page))
  globalThis.history.pushState({}, '', url.toString())

  // popstate 이벤트 리스너(예: usePageQuery에서 등록한 handler) 실행
  globalThis.dispatchEvent(new PopStateEvent('popstate'))
}
