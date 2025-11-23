import { useEffect, useRef, useState } from 'react'

type RMProps = { className?: string }

export default function RotatingMessages({ className }: RMProps) {
  const messages = [
     "Hey student! Scan this QR to unlock your library access.",
     "Ready to use the library? Scan here to register your ID!",
     "Quick heads up: Students, scan this to set up your library account.",
     "No more writing forms—just scan this QR to join the library!",
     "Students, tap your camera here and your library access is good to go.",
     "Want smooth library check-ins? Scan this QR to register your ID.",
     "Library crew only—scan here to activate your student ID.",
     "Make life easier! Scan this and your ID is instantly registered for the library.",
     "Students, scan this code and you're officially library-ready.",
     "Skip the line, skip the paperwork—scan to register your library ID.",
     "Your gateway to the library starts here. Scan this QR, student!",
     "Students only: Scan this to hook your ID into the library system.",
     "Let's get you in the library fast—scan to set up your ID.",
     "Scan this QR and your library access will be smoother than ever.",
     "Students, give this QR a quick scan to activate your library privileges.",
     "Almost there—scan this to finish your library registration.",
     "Your student ID wants to meet the library system. Scan to introduce them.",
     "Hit that QR with your camera and get instant library access.",
     "Students, tap 'scan' and your ID becomes library-ready in seconds.",
     "Scan this QR to set up your library ID—super quick, super easy."
  ]

  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisible(false)
      // brief delay to allow fade-out
      timeoutRef.current = window.setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length)
        setVisible(true)
      }, 300)
    }, 5000)

    return () => {
      window.clearInterval(interval)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [messages.length])

  return (
    <p
      aria-live="polite"
      className={`${className ?? ''} text-center mt-3 text-sm text-gray-600 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {messages[index]}
    </p>
  )
}
