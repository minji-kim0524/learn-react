import React from 'react'

type InputProps = {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
} & React.InputHTMLAttributes<HTMLInputElement>

export default function Input({ id, value, onChange, onSubmit }: InputProps) {
  // function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  // }

  return (
    <form
      className="flex flex-row gap-2 mx-auto my-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <label htmlFor={id} className="sr-only">
        검색창
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder="검색어를 입력해주세요"
        className="border-1 rounded-sm p-2"
      />
      <button type="submit" className="border-1 rounded-sm p-2">
        Search
      </button>
    </form>
  )
}
