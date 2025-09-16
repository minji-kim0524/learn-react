import Board from './components/board'
import History from './components/history'
import S from './game.module.css'
import useTicTacToe from './hooks/use-tic-tac-toe'

export default function TicTacToeGame() {
  const {
    statusMessage,
    winner,
    squares,
    playGame,
    gameHistory,
    gameIndex,
    restartGame,
    makeTimeTravel,
  } = useTicTacToe()

  return (
    <div className={S.Game}>
      <Board
        statusMessage={statusMessage}
        winner={winner}
        squares={squares}
        playGame={playGame}
      />
      <History
        items={gameHistory}
        gameIndex={gameIndex}
        onRestart={restartGame}
        makeTimeTravel={makeTimeTravel}
      />
    </div>
  )
}
