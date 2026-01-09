import { useEffect, useState } from 'react'
import { CharList } from './@types/global'
import Input from './components/Input'

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
    <>
      <img
        src="/public/footer_navi_logo.png"
        alt="로고"
        className="flex mx-auto"
      />
      <div className="flex flex-row gap-1">
        <Input id="name" />
      </div>
      <div className="flex flex-wrap gap-6 px-2">
        {data.map((item) => (
          <div className="flex flex-col items-center cursor-pointer">
            <img
              src={item.image_url}
              alt="사진"
              width={60}
              height={70}
              className=""
            />
            <p className="text-center border-1 rounded-2xl px-2">{item.name}</p>
          </div>
        ))}
      </div>
    </>
  )
}
