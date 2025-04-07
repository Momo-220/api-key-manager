"use client"

import { KeyRound, Database } from "lucide-react"
import { useTranslation } from "@/lib/translations"
import { useEffect, useState } from "react"
import { isFirebaseAvailable } from "@/lib/firebase"

export function Footer() {
  const { t } = useTranslation()
  const [isUsingFirebase, setIsUsingFirebase] = useState(false)

  useEffect(() => {
    // Vérifier si Firebase est disponible côté client
    setIsUsingFirebase(isFirebaseAvailable())
  }, [])

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <KeyRound className="h-4 w-4" />
          <span>API Manager</span>
          {isUsingFirebase && (
            <div className="flex items-center gap-1 ml-2 text-xs bg-primary/10 px-2 py-0.5 rounded-full">
              <Database className="h-3 w-3 text-primary" />
              <span>Firebase</span>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Tous droits réservés</div>
      </div>
    </footer>
  )
}

