"use client"

import { useEffect, useState } from "react"
import { KeyRound } from "lucide-react"
import { motion } from "framer-motion"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-background to-gray-950"
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="relative mb-6"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-950 shadow-lg">
            <motion.div
              animate={{
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            >
              <KeyRound className="h-12 w-12 text-primary" />
            </motion.div>
          </div>
        </motion.div>
        <motion.h1
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          API Manager
        </motion.h1>
        <motion.div
          className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-secondary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 2 }}
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

