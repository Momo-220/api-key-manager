"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/translations"

interface DatePickerProps {
  date: Date | null
  setDate: (date: Date | null) => void
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const { language } = useTranslation()
  const locale = language === "fr" ? fr : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale })
          ) : (
            <span>{language === "fr" ? "Sélectionner une date" : "Select a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date || undefined} onSelect={setDate} initialFocus locale={locale} />
      </PopoverContent>
    </Popover>
  )
}

