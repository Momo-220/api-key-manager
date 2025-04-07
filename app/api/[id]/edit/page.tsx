"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { toast } from "@/components/ui/use-toast"
import { getApiById, updateApi } from "@/lib/storage"
import { useTranslation } from "@/lib/translations"

export default function EditApiPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    name: "",
    key: "",
    url: "",
    category: "",
    description: "",
    expiresAt: null as Date | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadApi() {
      try {
        const api = await getApiById(id)
        if (api) {
          setFormData({
            name: api.name,
            key: api.key,
            url: api.url || "",
            category: api.category || "",
            description: api.description || "",
            expiresAt: api.expiresAt ? new Date(api.expiresAt) : null,
          })
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, expiresAt: date }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convertir la date en chaîne ISO si elle existe
      const expiresAtString = formData.expiresAt ? formData.expiresAt.toISOString() : null

      // Mettre à jour l'API
      const updated = await updateApi(id, {
        name: formData.name,
        key: formData.key,
        url: formData.url || undefined,
        category: formData.category || undefined,
        description: formData.description || undefined,
        expiresAt: expiresAtString,
      })

      if (updated) {
        toast({
          title: t("apiUpdated"),
          description: t("apiUpdatedDesc"),
        })

        // Rediriger vers la page de détail après la mise à jour
        router.push(`/api/${id}`)
      } else {
        throw new Error("Échec de la mise à jour")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'API:", error)
      toast({
        title: t("error"),
        description: t("errorUpdatingApi"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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

  return (
    <main className="container max-w-2xl py-8">
      <motion.div whileHover={{ x: -5 }} whileTap={{ x: -10 }} className="mb-8">
        <Link
          href={`/api/${id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-muted/30">
          <CardHeader>
            <CardTitle>{t("editApi")}</CardTitle>
            <CardDescription>{t("editApiDesc")}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t("apiName")}</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t("apiNamePlaceholder")}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key">{t("apiKey")}</Label>
                <Input
                  id="key"
                  name="key"
                  placeholder={t("apiKeyPlaceholder")}
                  value={formData.key}
                  onChange={handleChange}
                  required
                  type="password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">{t("apiUrl")}</Label>
                <Input
                  id="url"
                  name="url"
                  placeholder={t("apiUrlPlaceholder")}
                  value={formData.url}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t("category")}</Label>
                <Select value={formData.category} onValueChange={handleSelectChange}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t("selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">{t("categoryAI")}</SelectItem>
                    <SelectItem value="payment">{t("categoryPayment")}</SelectItem>
                    <SelectItem value="storage">{t("categoryStorage")}</SelectItem>
                    <SelectItem value="analytics">{t("categoryAnalytics")}</SelectItem>
                    <SelectItem value="communication">{t("categoryCommunication")}</SelectItem>
                    <SelectItem value="other">{t("categoryOther")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">{t("expirationDate")}</Label>
                <DatePicker date={formData.expiresAt} setDate={handleDateChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={t("descriptionPlaceholder")}
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      {t("saving")}
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{
                          y: [0, -2, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                      >
                        <Save className="h-4 w-4" />
                      </motion.div>
                      {t("save")}
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </main>
  )
}

