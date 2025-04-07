"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/lib/translations"

interface SearchBarProps {
  className?: string
  onSearch?: (term: string) => void
  onCategoryChange?: (category: string) => void
}

export function SearchBar({ className, onSearch, onCategoryChange }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const { t } = useTranslation()

  useEffect(() => {
    // Délai pour éviter trop d'appels pendant la frappe
    const timer = setTimeout(() => {
      onSearch?.(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, onSearch])

  useEffect(() => {
    onCategoryChange?.(category)
  }, [category, onCategoryChange])

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const handleClearCategory = () => {
    setCategory("")
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("search")}
          className="pl-9 pr-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t("clearSearch")}</span>
          </Button>
        )}
      </div>
      <div className="relative min-w-[180px]">
        <Select value={category || "all"} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder={t("allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            <SelectItem value="ai">{t("categoryAI")}</SelectItem>
            <SelectItem value="payment">{t("categoryPayment")}</SelectItem>
            <SelectItem value="storage">{t("categoryStorage")}</SelectItem>
            <SelectItem value="analytics">{t("categoryAnalytics")}</SelectItem>
            <SelectItem value="communication">{t("categoryCommunication")}</SelectItem>
            <SelectItem value="other">{t("categoryOther")}</SelectItem>
          </SelectContent>
        </Select>
        {category && category !== "all" && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-8 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={handleClearCategory}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t("clearSearch")}</span>
          </Button>
        )}
      </div>
    </div>
  )
}

