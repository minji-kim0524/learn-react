interface Props {
  count: number
  targetCount: number
}

export default function Output({ count, targetCount }: Props) {
  const isCompleted = count >= targetCount
  const classNames = `${baseClass} ${isCompleted ? '' : animateClass}`.trim()

  return <output className={classNames}>{count}</output>
}

const baseClass = `select-none [cursor:inherit] text-[30vh] font-['Spoqa_Han_Sans_Neo'] font-thin leading-none`
const animateClass = 'animate-[wiggle_600ms_infinite_alternate]'
