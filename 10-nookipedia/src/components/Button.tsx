/**
 * 프로필 선택 및 취소버튼을 표시하는 컴포넌트
 * @component
 * @param props - 버튼 컴포넌트 props
 * @param props.button1 - 버튼에 표시될 텍스트
 * @example
 * <Button button1="확인" />
 */

type Button = {
  button1: string
}

export default function Button({ button1 }: Button) {
  return <button>{button1}</button>
}
