import { useEffect, useState, useRef } from 'react'
import Notification2 from '@/sounds/Notification2.mp3'

const RestTimer = ({ timeRemaining, onTimerEnd }) => {
  const [seconds, setSeconds] = useState(timeRemaining)
  const audioRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1)
    }, 1000)

    if (seconds === 1) {
      audioRef.current.play()
    }

    if (seconds === 0) {
      clearInterval(timer)
      if (typeof onTimerEnd === 'function') {
        onTimerEnd()
      }
    }

    return () => clearInterval(timer)
  }, [seconds, onTimerEnd])

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  return (
    <div>
      <p className="text-xs font-bold">{formatTime(seconds)}</p>
      <audio ref={audioRef} src={Notification2} />
    </div>
  )
}

export default RestTimer
