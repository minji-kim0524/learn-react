import { SquaresType } from '../constants'
import HistoryItem from './history-item'
import S from './history.module.css'

export default function History({
  items,
  gameIndex,
  onRestart,
  makeTimeTravel,
}: {
  items: SquaresType[]
  gameIndex: number
  onRestart: () => void
  makeTimeTravel: (travelIndex: number) => () => void
}) {
  return (
    <div className={S.History}>
      <ol className={S.HistoryList}>
        {items.map((_, index) => (
          <HistoryItem
            key={index}
            index={index}
            isFirst={index === 0}
            selectedIndex={gameIndex === index}
            onRestart={onRestart}
            onTimeTravel={makeTimeTravel(index)}
          />
        ))}
      </ol>
    </div>
  )
}
