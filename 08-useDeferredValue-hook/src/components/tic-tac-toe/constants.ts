import type { MouseEvent } from 'react'

export type PlayerType = (typeof PLAYER)[keyof typeof PLAYER]

export type SquaresType = (PlayerType | null)[]

export type WinnerType = {
  player: PlayerType
  pattern: number[]
}

type WinnerPatternType = number[]

export type PlayGameFunctionType = (
  index: number,
  e: MouseEvent<HTMLButtonElement>
) => void

// --------------------------------------------------------------------------

export const GRID = {
  ROWS: 3,
  COLS: 3,
}

export const PLAYER = {
  ONE: '⚫️',
  TWO: '🟨',
} as const

export const getPlayerName = (player: PlayerType | null) => {
  if (!player) return '비어 있음'
  return player === PLAYER.ONE ? '플레이어 1' : '플레이어 2'
}

export const INITIAL_SQUARES: SquaresType = Array(GRID.ROWS * GRID.COLS).fill(
  null
)

const WINNER_PATTERN: WinnerPatternType[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [0, 4, 8],
]

export const checkWinner = (squares: SquaresType): WinnerType | null => {
  if (!squares) return null

  for (const [x, y, z] of WINNER_PATTERN) {
    const player = squares[x]

    if (player && player === squares[y] && player === squares[z]) {
      return { player, pattern: [x, y, z] }
    }
  }

  return null
}
