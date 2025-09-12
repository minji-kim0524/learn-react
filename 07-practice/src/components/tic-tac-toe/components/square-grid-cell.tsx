import { type MouseEvent } from 'react'
import { tw } from '@/utils'
import {
  GRID,
  type PlayGameFunctionType,
  type PlayerType,
  getPlayerName,
} from '../constants'
import S from './square-grid-cell.module.css'

export default function SquareGridCell({
  isWinnerPattern,
  children,
  index,
  onPlay,
}: {
  isWinnerPattern?: boolean
  children: PlayerType | null
  index: number
  onPlay: PlayGameFunctionType
}) {
  const isDisabled = !!children

  const playerName = getPlayerName(children)

  const label = `${index + 1}번째 칸, ${playerName}`

  const rowIndex = Math.floor(index / GRID.ROWS) + 1

  const colIndex = (index % GRID.COLS) + 1

  const handlePlay = (e: MouseEvent<HTMLButtonElement>) => onPlay(index, e)

  return (
    <button
      role="gridcell"
      className={tw(S.SquareGridCell, isWinnerPattern && 'bg-yellow-300!')}
      onClick={handlePlay}
      aria-disabled={isDisabled}
      aria-rowindex={rowIndex}
      aria-colindex={colIndex}
      aria-label={label}
    >
      {children}
    </button>
  )
}
