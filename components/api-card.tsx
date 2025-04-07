"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Copy, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { formatDate, formatTimeAgo } from "@/lib/utils"

interface ApiCardProps {
  api: {
    id: string
    name: string
    key: string
    url?: string
    expiresAt?: string | null
    category?: string
    description?: string
    createdAt: string
  }
}

export function ApiCard({ api }: ApiCardProps) {
  const [showKey, setShowKey] = useState(false)

  const toggleShowKey = () => {
    setShowKey(!showKey)
  }

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(api.key)
    toast({
      title: "Copié !",
      description: "La clé API a été copiée dans le presse-papier.",
      duration: 3000,
    })
  }

  const isExpiringSoon = api.expiresAt
    ? new Date(api.expiresAt).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000
    : false

  return (
    <Link href={`/api/${api.id}`}>
      <motion.div
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="h-full border-muted/30 transition-all hover:border-primary/20 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="line-clamp-1">{api.name}</CardTitle>
              {api.category && (
                <Badge variant="outline" className="ml-2">
                  {api.category}
                </Badge>
              )}
            </div>
            {api.expiresAt && (
              <CardDescription className="flex items-center gap-1 mt-2">
                <Calendar className="h-3 w-3" />
                {isExpiringSoon ? (
                  <span className="text-destructive">Expire le {formatDate(new Date(api.expiresAt))}</span>
                ) : (
                  <span>Expire le {formatDate(new Date(api.expiresAt))}</span>
                )}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-secondary p-2 rounded text-xs font-mono flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  {showKey ? api.key : "•".repeat(Math.min(20, api.key.length))}
                </div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleShowKey()
                    }}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showKey ? "Masquer" : "Afficher"}</span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copier</span>
                  </Button>
                </motion.div>
              </div>
              {api.description && <p className="text-sm text-muted-foreground line-clamp-2">{api.description}</p>}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">Ajouté {formatTimeAgo(new Date(api.createdAt))}</p>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  )
}

