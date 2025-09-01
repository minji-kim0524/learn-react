export default function Output(props) {
  const isCompleted = props.count >= props.targetCount

  return (
    <output className={`output ${isCompleted ? '' : 'is-animate'}`.trim()}>
      {props.count}
    </output>
  )
}
