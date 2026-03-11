import React from 'react'

interface FilterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  birthButton: string
}

export default function FilterButton({
  birthButton,
  className,
  ...props
}: FilterButtonProps) {
  return (
    <>
      <button
        {...props}
        className={`text-2xl font-semibold text-[#614f34] px-4 py-1 rounded-3xl border-0 ${className ?? ''}`}
      >
        {birthButton}
      </button>
    </>
  )
}
