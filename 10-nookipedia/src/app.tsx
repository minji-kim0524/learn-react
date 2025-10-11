import { useEffect, useState } from 'react'

const url = import.meta.env.VITE_URL
const API_KEY = import.meta.env.VITE_API_KEY

export default function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function get() {
      const response = await fetch(url, {
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
    <div>
      {data.map((item) => (
        <>
          <p>{item.name}</p>
          <img src={item.image_url} alt="사진" width={60} height={70} />
        </>
      ))}
    </div>
  )
}
