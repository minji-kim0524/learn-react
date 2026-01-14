import audioFile from '/public/navi_song.mp3'
import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeOff } from 'lucide-react'
import { CharList } from './@types/global'
import Input from './components/Input'
import Modal from './components/Modal'

const URL = import.meta.env.VITE_URL
const API_KEY = import.meta.env.VITE_API_KEY

export default function App() {
  const [data, setData] = useState<CharList[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  function handlePlayPause() {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioFile)
    }

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying((prev) => !prev)
  }

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
    <section className="p-2">
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-transparent border-0"
          onClick={handlePlayPause}
        >
          {isPlaying ? <Volume2 /> : <VolumeOff />}
        </button>
      </div>
      {data.map((item) => (
        <Modal
          open={isOpen}
          image={item.image_url}
          title={item.name}
          description="캐릭터설명"
          onClose={() => setIsOpen(false)}
        />
      ))}
      <img
        src="/footer_navi_logo.png"
        alt="로고"
        className="flex mx-auto mb-2"
      />
      <div className="flex flex-row gap-1 mb-2">
        <Input id="name" />
      </div>
      <div className="flex flex-wrap gap-6 px-2">
        {data.map((item) => (
          <div className="flex flex-col items-center cursor-pointer">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="bg-transparent border-0 cursor-pointer"
            >
              <img
                src={item.image_url}
                alt="사진"
                width={60}
                height={70}
                className=""
              />
            </button>
            <p className="text-center border-1 rounded-2xl px-2">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
