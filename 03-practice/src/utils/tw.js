import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 클래스명을 병합하는 유틸리티 함수
 * clsx로 조건부 클래스명을 처리하고, tailwind-merge로 충돌을 해결합니다.
 *
 * @param {...(string|object|array)} classNames - 병합할 클래스명들
 * @returns {string} 병합된 클래스명 문자열
 */
export default function tw(...classNames) {
  return twMerge(clsx(...classNames))
}
