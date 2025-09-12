/**
 * 지정된 범위 내에서 랜덤한 숫자를 반환하는 함수
 * @param min - 최소값 (기본값: 1)
 * @param max - 최대값 (기본값: 10)
 * @returns 랜덤한 숫자
 */
export function getRandomCount(min = 1, max = 10) {
  return Math.round(Math.random() * (max - min) + min)
}

/**
 * 0부터 360 사이의 랜덤한 색상 값(Hue)을 반환하는 함수
 * @returns 랜덤한 Hue 색상 값 (0-360)
 */
export function getRandomHueColor() {
  return getRandomCount(0, 360)
}

/**
 * 랜덤한 Hue 색상 값을 문서의 CSS 변수(--hue)에 설정하는 함수
 */
export function setAppColor() {
  const value = getRandomHueColor()
  document.body.style.setProperty('--hue', `${value}`)
}

/**
 * 문서의 제목을 설정하는 함수
 * @param targetCount - 제목에 표시할 카운트 값
 */
export const setDocumentTitle = (() => {
  const ORIGIN_TITLE = document.title
  return function setDocumentTitle(targetCount: number | string) {
    document.title = `(${targetCount}) ${ORIGIN_TITLE}`
  }
})()
