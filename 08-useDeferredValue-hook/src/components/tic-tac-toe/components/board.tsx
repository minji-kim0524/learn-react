import type {
  PlayGameFunctionType,
  SquaresType,
  WinnerType,
} from '../constants'
import SquaresGrid from './squares-grid'
import Status from './status'

interface Props {
  statusMessage: string
  winner: WinnerType | null
  squares: SquaresType
  playGame: PlayGameFunctionType
}

export default function Board({
  statusMessage,
  winner,
  squares,
  playGame,
}: Props) {
  return (
    <div className="Board">
      <Status>{statusMessage}</Status>
      <SquaresGrid winner={winner} squares={squares} onPlay={playGame} />
    </div>
  )
}
