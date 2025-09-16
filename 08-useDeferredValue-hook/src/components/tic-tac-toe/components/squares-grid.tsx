import { type KeyboardEvent } from 'react'
import {
  GRID,
  type PlayGameFunctionType,
  type SquaresType,
  type WinnerType,
} from '../constants'
import SquareGridCell from './square-grid-cell'
import S from './squares-grid.module.css'

export default function SquaresGrid({
  winner,
  squares,
  onPlay,
}: {
  winner: WinnerType | null
  squares: SquaresType
  onPlay: PlayGameFunctionType
}) {
  const handleKeyControls = (e: KeyboardEvent<HTMLDivElement>) => {
    const { key } = e

    if (key === 'Tab' || key === 'Enter' || key === ' ' /* SpaceBar */) return

    e.preventDefault()

    const target = e.target as HTMLElement
    let rowIndex = Number(target.getAttribute('aria-rowindex'))
    let colIndex = Number(target.getAttribute('aria-colindex'))

    switch (key) {
      case 'ArrowRight':
        if (colIndex <= GRID.COLS) colIndex += 1
        break
      case 'ArrowLeft':
        if (colIndex > 1) colIndex -= 1
        break
      case 'ArrowUp':
        if (rowIndex > 1) rowIndex -= 1
        break
      case 'ArrowDown':
        if (colIndex <= GRID.ROWS) rowIndex += 1
        break
      case 'Escape':
        console.log('Esc')
        break
    }

    const grid = target.closest('[role="grid"]')
    const focusGridCell = grid?.querySelector(
      `[aria-rowindex="${rowIndex}"][aria-colindex="${colIndex}"]`
    )

    if (focusGridCell) (focusGridCell as HTMLElement).focus()
  }

  return (
    <div
      role="grid"
      tabIndex={-1}
      onKeyDown={handleKeyControls}
      className={S.SquaresGrid}
      aria-label="틱택토 게임판"
      aria-rowcount={GRID.ROWS}
      aria-colcount={GRID.COLS}
    >
      {squares.map((square, index) => {
        const isWinnerPattern = winner?.pattern?.includes(index)
        return (
          <SquareGridCell
            isWinnerPattern={isWinnerPattern}
            key={index}
            index={index}
            onPlay={onPlay}
          >
            {square}
          </SquareGridCell>
        )
      })}
    </div>
  )
}
