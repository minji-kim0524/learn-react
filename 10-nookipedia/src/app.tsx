import audioFile from '/public/navi_song.mp3'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Volume2, VolumeOff } from 'lucide-react'
import { CharList } from './@types/global'
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
  const [currentPage, setCurrentPage] = useState<number>(1)

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
    if (!query.trim()) {
      alert('검색어를 입력해주세요')
      return
    }

    const searchedData = data.filter((v) =>
      v.name.toLowerCase().includes(query.toLowerCase())
    )

    setFilteredData(searchedData)
    setIsSearched(true)

    setCurrentPage(1)
    setQuery('')
  }

  function handleBackHome() {
    setQuery('')
    setFilteredData([])
    setIsSearched(false)
    setCurrentPage(1)
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
      setData(responseData)
    }
    get()
  }, [])

  // 페이지네이션
  const DATA_PER_PAGE = 75
  const startIndex = (currentPage - 1) * DATA_PER_PAGE
  const endIndex = startIndex + DATA_PER_PAGE
  const TOTAL_PAGES = Math.ceil(data.length / DATA_PER_PAGE)

  const pagedData = data.slice(startIndex, endIndex)

  const responseData = isSearched ? filteredData : pagedData
  const noResponseData = isSearched && filteredData.length === 0

  // 페이지네이션 번호 표시
  const pageNumbers = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1)

  // 이전, 다음 버튼
  function handlePrevNextPage(condition: string) {
    if (condition === 'prev') {
      setCurrentPage(currentPage - 1)
    } else {
      setCurrentPage(currentPage + 1)
    }
  }

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
      </div>
      {/* 검색결과 없을 경우 */}
      {noResponseData && (
        <div className="flex flex-col items-center">
          <img
            src="/noresult.jpg"
            alt="검색결과없음"
            width={250}
            className="rounded-full"
          />
          <p className="font-medium">
            검색결과가 없어요! 검색어를 다시 확인해주세요
          </p>
        </div>
      )}
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
      {/* 페이지네이션 번호버튼 */}
      <div className="flex gap-2 justify-center mt-7">
        <button
          type="button"
          className="border-none bg-transparent"
          title="이전"
          onClick={() => handlePrevNextPage('prev')}
          disabled={currentPage === 1}
        >
          <ChevronLeft strokeWidth="3" />
        </button>
        {pageNumbers.map((page) => (
          <button
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded-md border-none text-[18px] border
            ${currentPage === page ? 'bg-black text-white' : 'bg-white text-black'}
            `}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className="border-none bg-transparent"
          title="다음"
          onClick={() => handlePrevNextPage('next')}
          disabled={currentPage === TOTAL_PAGES}
        >
          <ChevronRight strokeWidth="3" />
        </button>
      </div>
    </section>
  )
}
