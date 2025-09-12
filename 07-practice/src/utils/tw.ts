import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 클래스명을 병합하는 유틸리티 함수
 * clsx로 조건부 클래스명을 처리하고, tailwind-merge로 충돌을 해결합니다.
 */
export default function tw(...classNames: ClassValue[]) {
  return twMerge(clsx(...classNames))
}
