"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Copy, Edit, Eye, EyeOff, Trash } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"
import { getApiById, deleteApi, type ApiKey } from "@/lib/storage"
import { useTranslation } from "@/lib/translations"

export default function ApiDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const { t } = useTranslation()

  const [apiData, setApiData] = useState<ApiKey | null>(null)
  const [showKey, setShowKey] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadApi() {
      try {
        const api = await getApiById(id)
        if (api) {
          setApiData(api)
        } else {
          toast({
            title: t("apiNotFound"),
            description: t("apiNotFoundDesc"),
            variant: "destructive",
          })
          router.push("/")
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'API:", error)
        toast({
          title: t("error"),
          description: t("apiNotFoundDesc"),
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    loadApi()
  }, [id, router, t])

  const toggleShowKey = () => {
    setShowKey(!showKey)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: t("copied"),
      description: t("copiedDesc").replace("{label}", label),
      duration: 3000,
    })
  }

  const handleDelete = async () => {
    try {
      const success = await deleteApi(id)
      if (success) {
        toast({
          title: t("apiDeleted"),
          description: t("apiDeletedDesc"),
        })
        router.push("/")
      } else {
        toast({
          title: t("error"),
          description: t("errorDeletingApi"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'API:", error)
      toast({
        title: t("error"),
        description: t("errorDeletingApi"),
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <main className="container max-w-2xl py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </main>
    )
  }

  if (!apiData) {
    return (
      <main className="container max-w-2xl py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">{t("apiNotFound")}</h2>
          <p className="mt-2 text-muted-foreground">{t("apiNotFoundDesc")}</p>
          <Link href="/" className="mt-6 inline-block">
            <Button>{t("back")}</Button>
          </Link>
        </div>
      </main>
    )
  }

  const isExpiringSoon = apiData.expiresAt
    ? new Date(apiData.expiresAt).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000
    : false

  return (
    <main className="container max-w-2xl py-8">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Link>
      </div>

      <Card className="border-muted/30">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{apiData.name}</CardTitle>
            <CardDescription className="mt-2">
              {apiData.category && (
                <Badge variant="outline" className="mr-2">
                  {apiData.category}
                </Badge>
              )}
              {apiData.expiresAt && (
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {isExpiringSoon ? (
                    <span className="text-destructive">
                      {t("expiresOn").replace("{date}", formatDate(new Date(apiData.expiresAt)))}
                    </span>
                  ) : (
                    <span>{t("expiresOn").replace("{date}", formatDate(new Date(apiData.expiresAt)))}</span>
                  )}
                </Badge>
              )}
            </CardDescription>
          </div>
          <Link href={`/api/${id}/edit`}>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
              <span className="sr-only">{t("edit")}</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("apiKey")}</h3>
            <div className="flex items-center gap-2">
              <div className="bg-secondary p-3 rounded-md text-sm font-mono flex-1 overflow-x-auto whitespace-nowrap">
                {showKey ? apiData.key : "•".repeat(Math.min(24, apiData.key.length))}
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="icon" onClick={toggleShowKey}>
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showKey ? t("hide") : t("show")}</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(apiData.key, t("apiKey"))}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">{t("copy")}</span>
                </Button>
              </motion.div>
            </div>
          </div>

          {apiData.url && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("apiUrl")}</h3>
              <div className="flex items-center gap-2">
                <div className="bg-secondary p-3 rounded-md text-sm flex-1 overflow-x-auto whitespace-nowrap">
                  {apiData.url}
                </div>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(apiData.url || "", t("apiUrl"))}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">{t("copy")}</span>
                </Button>
              </div>
            </div>
          )}

          {apiData.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("description")}</h3>
              <div className="bg-secondary p-3 rounded-md text-sm">{apiData.description}</div>
            </div>
          )}

          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              {t("createdOn").replace("{date}", formatDate(new Date(apiData.createdAt)))}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="destructive" className="w-full gap-2">
                  <motion.div animate={{ x: [0, -2, 2, -2, 0] }} transition={{ duration: 0.5 }}>
                    <Trash className="h-4 w-4" />
                  </motion.div>
                  {t("delete")}
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("confirmDelete")}</DialogTitle>
                <DialogDescription>{t("confirmDeleteDesc")}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  {t("delete")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </main>
  )
}

