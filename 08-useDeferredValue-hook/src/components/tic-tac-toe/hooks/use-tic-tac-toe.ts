import { MouseEvent, useCallback, useState } from 'react'
import {
  GRID,
  INITIAL_SQUARES,
  PLAYER,
  PlayGameFunctionType,
  PlayerType,
  SquaresType,
  checkWinner,
} from '../constants'

export default function useTicTacToe() {
  const [gameHistory, setGameHistory] = useState<SquaresType[]>([
    INITIAL_SQUARES,
  ])

  const [gameIndex, setGameIndex] = useState<number>(0)

  const squares: SquaresType = gameHistory[gameIndex]

  const nextPlayer: PlayerType = gameIndex % 2 === 0 ? PLAYER.ONE : PLAYER.TWO

  const winner = checkWinner(squares)

  const isDraw = !winner && gameIndex === GRID.COLS * GRID.ROWS

  const playGame: PlayGameFunctionType = useCallback(
    (squareIndex: number, e: MouseEvent<HTMLButtonElement>) => {
      if (winner) {
        return alert('GAME OVER')
      }

      const target = e.target as HTMLButtonElement

      if (target.getAttribute('aria-disabled') === 'true') {
        return alert('이미 게임이 진행된 칸입니다. 다른 빈 칸에 말을 놓으세요.')
      }

      const nextGameIndex = gameIndex + 1
      setGameIndex(nextGameIndex)

      const nextSquares = squares.map((square, index) =>
        index === squareIndex ? nextPlayer : square
      )

      const nextGameHistory = [
        ...gameHistory.slice(0, nextGameIndex),
        nextSquares,
      ]
      setGameHistory(nextGameHistory)
    },
    [gameHistory, gameIndex, nextPlayer, squares, winner]
  )

  const restartGame = useCallback(() => {
    setGameHistory([INITIAL_SQUARES])
    setGameIndex(0)
  }, [])

  const makeTimeTravel = useCallback(
    (travelIndex: number) => () => {
      setGameIndex(travelIndex)
    },
    []
  )

  let statusMessage = `다음 플레이어 ${nextPlayer}`
  if (winner) statusMessage = `게임 위너! ${winner.player}`
  if (isDraw) statusMessage = '무승부! 게임 위너는 없습니다.'

  return {
    gameHistory,
    gameIndex,
    squares,
    nextPlayer,
    winner,
    isDraw,
    playGame,
    restartGame,
    makeTimeTravel,
    statusMessage,
  }
}
