
'use client'
import { useEffect, useRef } from 'react'

const RestTimer = ({ timeRemaining, setTimeRemaining }) => {
  const audioRef = useRef(null)

  useEffect(() => {
    let intervalId

    if (timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      // Play a beep sound when the timer reaches 0
      audioRef.current.play()
    }

    return () => clearInterval(intervalId)
  }, [timeRemaining, setTimeRemaining])

  return (
    <div>
      <p className="text-lg font-bold">Rest Timer: {timeRemaining} seconds</p>
      <audio ref={audioRef}>
        <source src="/sounds/Notification.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export default RestTimer
