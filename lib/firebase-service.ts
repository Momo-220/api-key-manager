import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { getFirestore, isFirebaseAvailable } from "./firebase"
import type { ApiKey } from "./storage"

// Collection Firestore
const COLLECTION_NAME = "api-keys"

// Fonction pour récupérer toutes les API
export async function getAllApisFromFirebase(): Promise<ApiKey[]> {
  if (!isFirebaseAvailable()) return []

  try {
    const db = getFirestore()
    if (!db) return []

    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ApiKey[]
  } catch (error) {
    console.error("Erreur lors de la récupération des API depuis Firebase:", error)
    return []
  }
}

// Fonction pour récupérer une API par ID
export async function getApiByIdFromFirebase(id: string): Promise<ApiKey | null> {
  if (!isFirebaseAvailable()) return null

  try {
    const db = getFirestore()
    if (!db) return null

    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ApiKey
    } else {
      return null
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'API depuis Firebase:", error)
    return null
  }
}

// Fonction pour ajouter une nouvelle API
export async function addApiToFirebase(api: Omit<ApiKey, "id">): Promise<ApiKey | null> {
  if (!isFirebaseAvailable()) return null

  try {
    const db = getFirestore()
    if (!db) return null

    const docRef = await addDoc(collection(db, COLLECTION_NAME), api)
    return { id: docRef.id, ...api }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'API à Firebase:", error)
    return null
  }
}

// Fonction pour mettre à jour une API
export async function updateApiInFirebase(id: string, updates: Partial<Omit<ApiKey, "id">>): Promise<boolean> {
  if (!isFirebaseAvailable()) return false

  try {
    const db = getFirestore()
    if (!db) return false

    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, updates)
    return true
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'API dans Firebase:", error)
    return false
  }
}

// Fonction pour supprimer une API
export async function deleteApiFromFirebase(id: string): Promise<boolean> {
  if (!isFirebaseAvailable()) return false

  try {
    const db = getFirestore()
    if (!db) return false

    await deleteDoc(doc(db, COLLECTION_NAME, id))
    return true
  } catch (error) {
    console.error("Erreur lors de la suppression de l'API de Firebase:", error)
    return false
  }
}

// Fonction pour rechercher des API
export async function searchApisInFirebase(searchTerm: string, category?: string): Promise<ApiKey[]> {
  if (!isFirebaseAvailable()) return []

  try {
    // Pour une recherche plus avancée, il faudrait utiliser un service comme Algolia
    // Cette implémentation est simplifiée et récupère toutes les API puis filtre côté client
    const apis = await getAllApisFromFirebase()

    return apis.filter((api) => {
      const matchesSearch =
        !searchTerm ||
        api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (api.description && api.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (api.url && api.url.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = !category || category === "all" || api.category === category

      return matchesSearch && matchesCategory
    })
  } catch (error) {
    console.error("Erreur lors de la recherche d'API dans Firebase:", error)
    return []
  }
}

