import {
  getAllApisFromFirebase,
  getApiByIdFromFirebase,
  addApiToFirebase,
  updateApiInFirebase,
  deleteApiFromFirebase,
  searchApisInFirebase,
} from "./firebase-service"
import { isFirebaseAvailable } from "./firebase"

// Types pour nos données
export interface ApiKey {
  id: string
  name: string
  key: string
  url?: string
  expiresAt?: string | null
  category?: string
  description?: string
  createdAt: string
}

// Clé de stockage local
const STORAGE_KEY = "api-manager-data"

// Données initiales de démonstration
const initialData: ApiKey[] = [
  {
    id: "1",
    name: "OpenAI API",
    key: "sk-1234567890abcdefghijklmnopqrstuvwxyz",
    url: "https://api.openai.com",
    expiresAt: "2024-12-31",
    category: "AI",
    description: "API pour accéder aux modèles GPT et autres services OpenAI",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Stripe API",
    key: "sk_test_abcdefghijklmnopqrstuvwxyz1234567890",
    url: "https://api.stripe.com",
    expiresAt: null,
    category: "Paiement",
    description: "API pour gérer les paiements et les abonnements",
    createdAt: "2023-02-20",
  },
  {
    id: "3",
    name: "Cloudinary API",
    key: "cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz@cloud",
    url: "https://api.cloudinary.com",
    expiresAt: "2025-06-15",
    category: "Stockage",
    description: "API pour la gestion des médias et des images",
    createdAt: "2023-03-10",
  },
]

// Fonction pour générer un ID unique
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Fonction pour récupérer toutes les API
export async function getAllApis(): Promise<ApiKey[]> {
  try {
    if (isFirebaseAvailable()) {
      const firebaseApis = await getAllApisFromFirebase()
      if (firebaseApis.length > 0) {
        return firebaseApis
      }
    }
  } catch (error) {
    console.error("Erreur Firebase, utilisation du stockage local:", error)
  }

  // Fallback au stockage local
  if (typeof window === "undefined") {
    return initialData
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    // Initialiser avec les données de démonstration lors de la première utilisation
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
    return initialData
  }

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error)
    return []
  }
}

// Fonction pour récupérer une API par ID
export async function getApiById(id: string): Promise<ApiKey | undefined> {
  try {
    if (isFirebaseAvailable()) {
      const api = await getApiByIdFromFirebase(id)
      if (api) {
        return api
      }
    }
  } catch (error) {
    console.error("Erreur Firebase, utilisation du stockage local:", error)
  }

  // Fallback au stockage local
  const apis = await getAllApis()
  return apis.find((api) => api.id === id)
}

// Fonction pour ajouter une nouvelle API
export async function addApi(api: Omit<ApiKey, "id" | "createdAt">): Promise<ApiKey | undefined> {
  const newApi: Omit<ApiKey, "id"> = {
    ...api,
    createdAt: new Date().toISOString(),
  }

  try {
    if (isFirebaseAvailable()) {
      const addedApi = await addApiToFirebase(newApi)
      if (addedApi) {
        return addedApi
      }
    }
  } catch (error) {
    console.error("Erreur Firebase, utilisation du stockage local:", error)
  }

  // Fallback au stockage local
  const apis = await getAllApis()
  const apiWithId: ApiKey = {
    ...newApi,
    id: generateId(),
  }

  apis.push(apiWithId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apis))

  return apiWithId
}

// Fonction pour mettre à jour une API
export async function updateApi(
  id: string,
  updates: Partial<Omit<ApiKey, "id" | "createdAt">>,
): Promise<ApiKey | undefined> {
  try {
    if (isFirebaseAvailable()) {
      const success = await updateApiInFirebase(id, updates)
      if (success) {
        return await getApiById(id)
      }
    }
  } catch (error) {
    console.error("Erreur Firebase, utilisation du stockage local:", error)
  }

  // Fallback au stockage local
  const apis = await getAllApis()
  const index = apis.findIndex((api) => api.id === id)

  if (index === -1) {
    return undefined
  }

  apis[index] = { ...apis[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apis))

  return apis[index]
}

// Fonction pour supprimer une API
export async function deleteApi(id: string): Promise<boolean> {
  try {
    if (isFirebaseAvailable()) {
      const success = await deleteApiFromFirebase(id)
      if (success) {
        return true
      }
    }
  } catch (error) {
    console.error("Erreur Firebase, utilisation du stockage local:", error)
  }

  // Fallback au stockage local
  const apis = await getAllApis()
  const filteredApis = apis.filter((api) => api.id !== id)

  if (filteredApis.length === apis.length) {
    return false
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredApis))
  return true
}

// Fonction pour rechercher des APIs
export async function searchApis(query: string, category?: string): Promise<ApiKey[]> {
  try {
    if (isFirebaseAvailable()) {
      return await searchApisInFirebase(query, category)
    }
  } catch (error) {
    console.error("Erreur Firebase, utilisation du stockage local:", error)
  }

  // Fallback au stockage local
  const apis = await getAllApis()

  return apis.filter((api) => {
    const matchesQuery =
      !query ||
      api.name.toLowerCase().includes(query.toLowerCase()) ||
      (api.description && api.description.toLowerCase().includes(query.toLowerCase())) ||
      (api.url && api.url.toLowerCase().includes(query.toLowerCase()))

    const matchesCategory = !category || category === "all" || api.category === category

    return matchesQuery && matchesCategory
  })
}

