/**
 * CSS 선택자 문자열로, 키보드 탐색(Tab)이 가능한 요소들을 선택합니다.
 */
const tabbableSelector = [
  'a[href]', // 링크
  'area[href]', // 이미지 맵 영역
  'button', // 버튼
  'input', // 입력 필드
  'select', // 선택 상자
  'textarea', // 텍스트 영역
  'iframe', // 인라인 프레임
  'summary', // 요약 요소
  'details', // 상세 정보 요소
  'video[controls]', // 컨트롤이 있는 비디오
  'audio[controls]', // 컨트롤이 있는 오디오
  '[contenteditable]:not([contenteditable="false"])', // 편집 가능한 콘텐츠
  '[tabindex]:not([tabindex="-1"])', // 양수 tabindex를 가진 요소
].join(',')

/**
 * 주어진 컨테이너 내에서 탭 이동이 가능한 모든 요소를 반환합니다.
 *
 * @param container - 탭 이동 가능한 요소를 검색할 HTML 컨테이너
 * @returns 탭 이동 가능한 요소 배열
 */
export function getTabbableElements(container: HTMLElement) {
  const tabbables = container.querySelectorAll(tabbableSelector)

  return Array.from(tabbables).filter((tabbable) => {
    const element = tabbable as HTMLElement
    const isntDisabled = !element.hasAttribute('disabled') // 비활성화되지 않음
    const isTabbable = element.tabIndex >= 0 // tabIndex가 0 이상
    const isVisible =
      element.offsetParent !== null && // 화면에 렌더링됨
      globalThis.getComputedStyle(tabbable).visibility !== 'hidden' // 숨겨지지 않음

    return isntDisabled && isTabbable && isVisible
  })
}

/**
 * 주어진 요소가 포커스 가능한지 확인합니다.
 *
 * 이 함수는 실제로 요소에 포커스를 시도하여 포커스 가능 여부를 테스트합니다.
 *
 * @param elementNode - 포커스 가능 여부를 테스트할 HTML 요소
 * @returns 요소가 포커스 가능하면 true, 그렇지 않으면 false
 */
export const isFocusable = (elementNode: HTMLElement) => {
  const current = document.activeElement
  if (current === elementNode) return true // 이미 포커스 상태면 true 반환

  // 이벤트 전파 방지 핸들러
  const protectEvent = (e: globalThis.FocusEvent) => {
    e.stopImmediatePropagation()
  }

  elementNode.addEventListener('focus', protectEvent, true)
  elementNode.addEventListener('blur', protectEvent, true)
  elementNode.focus({ preventScroll: true })

  const result = document.activeElement === elementNode
  elementNode.blur()

  if (current) (current as HTMLElement).focus({ preventScroll: true })
  elementNode.removeEventListener('focus', protectEvent, true)
  elementNode.removeEventListener('blur', protectEvent, true)

  return result
}
