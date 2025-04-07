"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ApiCard } from "@/components/api-card"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { getAllApis, searchApis, type ApiKey } from "@/lib/storage"
import { useTranslation } from "@/lib/translations"

export default function Home() {
  const [apis, setApis] = useState<ApiKey[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    // Charger les données au montage du composant
    const loadApis = async () => {
      setIsLoading(true)
      try {
        const data = await getAllApis()
        setApis(data)
      } catch (error) {
        console.error("Erreur lors du chargement des API:", error)
        setApis([])
      } finally {
        setIsLoading(false)
      }
    }

    loadApis()
  }, [])

  useEffect(() => {
    // Filtrer les APIs lorsque les critères de recherche changent
    const filterApis = async () => {
      if (!isLoading) {
        try {
          if (searchTerm || category) {
            const filteredApis = await searchApis(searchTerm, category)
            setApis(filteredApis)
          } else {
            const allApis = await getAllApis()
            setApis(allApis)
          }
        } catch (error) {
          console.error("Erreur lors de la recherche des API:", error)
        }
      }
    }

    filterApis()
  }, [searchTerm, category, isLoading])

  return (
    <main className="container max-w-5xl py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("myApiKeys")}</h1>
        <Link href="/api/new">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="gap-2">
              <motion.div initial={{ rotate: 0 }} whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                <Plus className="h-4 w-4" />
              </motion.div>
              {t("newApi")}
            </Button>
          </motion.div>
        </Link>
      </div>

      <SearchBar className="mb-8" onSearch={setSearchTerm} onCategoryChange={setCategory} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : apis.length > 0 ? (
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            staggerChildren: 0.1,
            delayChildren: 0.2,
          }}
        >
          {apis.map((api, index) => (
            <motion.div
              key={api.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ApiCard api={api} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState />
      )}
    </main>
  )
}

