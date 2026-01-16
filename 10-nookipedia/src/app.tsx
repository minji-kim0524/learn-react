import audioFile from '/public/navi_song.mp3'
import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeOff } from 'lucide-react'
import { CharList } from './@types/global'
import Button from './components/Button'
import Input from './components/Input'
import Modal from './components/Modal'

type CharacterInfo = {
  image_url: string
  name: string
  quote?: string
}

const URL = import.meta.env.VITE_URL
const API_KEY = import.meta.env.VITE_API_KEY

export default function App() {
  const [data, setData] = useState<CharList[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CharacterInfo>()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [query, setQuery] = useState('')
  const [filteredData, setFilteredData] = useState<CharacterInfo[]>([])
  const [isSearched, setIsSearched] = useState(false)

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

  function handleSearch() {
    const searchedData = data.filter((v) =>
      v.name.toLowerCase().includes(query.toLowerCase())
    )

    console.log(searchedData)
    setFilteredData(searchedData)
    setIsSearched(true)

    setQuery('')
  }

  function handleBackHome() {
    setQuery('')
    setFilteredData([])
    setIsSearched(false)
    // setSelectedItem()
  }

  useEffect(() => {
    async function get() {
      const response = await fetch(URL, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
      })

      const responseData = await response.json()
      console.log(responseData)
      console.log(responseData[0])
      setData(responseData)
    }
    get()
  }, [])

  const responseData = isSearched ? filteredData : data

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
      {selectedItem && (
        <Modal
          open={isOpen}
          image={selectedItem.image_url}
          title={selectedItem.name}
          description={selectedItem.quote ?? ''}
          onClose={() => setIsOpen(false)}
        />
      )}
      <button
        type="button"
        onClick={handleBackHome}
        className="flex mx-auto mb-2 bg-transparent border-none"
      >
        <img src="/footer_navi_logo.png" alt="로고" />
      </button>
      <div className="flex flex-row gap-1 mb-2">
        <Input
          id="name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSubmit={handleSearch}
        />
        {/* <Button /> */}
      </div>
      <div className="flex flex-wrap gap-6 px-2">
        {responseData.map((item) => (
          <div className="flex flex-col items-center cursor-pointer hover:scale-120 hover:transition-transform">
            <button
              type="button"
              onClick={() => {
                setSelectedItem(item)
                setIsOpen(true)
              }}
              className="bg-transparent border-0 cursor-pointer"
            >
              <img
                src={item.image_url}
                alt="사진"
                width={60}
                height={70}
                className="border-none"
              />
            </button>
            <p className="text-center border-1 rounded-2xl px-2">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
