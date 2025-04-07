"use client"

import { KeyRound, Plus } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/translations"

export function EmptyState() {
  const { t } = useTranslation()

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex h-20 w-20 items-center justify-center rounded-full bg-muted"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
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
          <KeyRound className="h-10 w-10 text-muted-foreground" />
        </motion.div>
      </motion.div>
      <motion.h2
        className="mt-6 text-xl font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {t("noApis")}
      </motion.h2>
      <motion.p
        className="mt-2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {t("noApisDesc")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6"
      >
        <Link href="/api/new">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="gap-2">
              <motion.div initial={{ rotate: 0 }} whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                <Plus className="h-4 w-4" />
              </motion.div>
              {t("addFirstApi")}
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

