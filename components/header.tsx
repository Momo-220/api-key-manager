"use client"

import Link from "next/link"
import { KeyRound } from "lucide-react"
import { motion } from "framer-motion"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useTranslation } from "@/lib/translations"

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
            <KeyRound className="h-5 w-5" />
          </motion.div>
          <span>API Manager</span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

