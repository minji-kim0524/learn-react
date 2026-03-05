interface FilterButtonProps {
  birthButton: string
}

export default function FilterButton({ birthButton }: FilterButtonProps) {
  return (
    <>
      <button className="text-2xl font-semibold text-[#614f34] bg-white px-4 py-1 rounded-3xl border-0">
        {birthButton}
      </button>
    </>
  )
}
