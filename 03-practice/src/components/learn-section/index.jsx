import { tw } from '@/utils'

/**
 * LearnSection 컴포넌트
 * @param {Object} props - 컴포넌트 속성
 * @param {string} props.title - 섹션 제목 (시각적으로 감춰짐)
 * @param {boolean} props.showTitle - 섹션 제목 표시
 * @param {React.ReactNode} props.children - 섹션 내부에서 렌더링 할 자식 요소
 */
export default function LearnSection({
  title,
  showTitle = false,
  children,
  className,
  ...restProps
}) {
  return (
    <section className={tw('p-5', className)} {...restProps}>
      <h1 className={tw('text-2xl font-semibold', [showTitle || 'sr-only'])}>
        {title}
      </h1>
      {children}
    </section>
  )
}
