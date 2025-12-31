export default function Input({ id }: { id: string }) {
  return (
    <form className="flex flex-row gap-2 mx-auto my-4">
      <label htmlFor={id} className="sr-only">
        검색창
      </label>
      <input
        id={id}
        type="text"
        placeholder="검색어를 입력해주세요"
        className="border-1 rounded-sm p-2"
      />
      <button className="border-1 rounded-sm p-2">Search</button>
    </form>
  )
}
