"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 z-50"
      style={{ width: `${scrollProgress}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    />
  )
}
