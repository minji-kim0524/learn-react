import { useEffect, useState } from 'react'
import { CharList } from './@types/global'

const URL = import.meta.env.VITE_URL
const API_KEY = import.meta.env.VITE_API_KEY

export default function App() {
  const [data, setData] = useState<CharList[]>([])

  useEffect(() => {
    async function get() {
      const response = await fetch(URL, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
      })

      console.log(response)
      const responseData = await response.json()
      console.log(responseData)
      setData(responseData)
    }
    get()
  }, [])

  return (
    <div className="flex flex-wrap gap-6">
      {data.map((item) => (
        <div className="flex flex-col">
          <img
            src={item.image_url}
            alt="사진"
            width={60}
            height={70}
            className=""
          />
          <p className="text-center">{item.name}</p>
        </div>
      ))}
    </div>
  )
}
