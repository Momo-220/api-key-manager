import { ref, get, set, remove, query, orderByChild, startAt, endAt } from "firebase/database";
import { getDatabase, isFirebaseAvailable } from "./firebase";
import type { ApiKey } from "./storage";

// Référence de la base de données
const DB_REF = "api-keys";

// Fonction pour récupérer toutes les API
export async function getAllApisFromFirebase(): Promise<ApiKey[]> {
  if (!isFirebaseAvailable()) return [];

  try {
    const db = getDatabase();
    if (!db) return [];

    const snapshot = await get(ref(db, DB_REF));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data).map(([id, value]) => ({
        id,
        ...(value as Omit<ApiKey, "id">),
      }));
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des API depuis Firebase:", error);
    return [];
  }
}

// Fonction pour récupérer une API par ID
export async function getApiByIdFromFirebase(id: string): Promise<ApiKey | null> {
  if (!isFirebaseAvailable()) return null;

  try {
    const db = getDatabase();
    if (!db) return null;

    const snapshot = await get(ref(db, `${DB_REF}/${id}`));
    if (snapshot.exists()) {
      return {
        id,
        ...snapshot.val(),
      };
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'API depuis Firebase:", error);
    return null;
  }
}

// Fonction pour ajouter une nouvelle API
export async function addApiToFirebase(api: Omit<ApiKey, "id">): Promise<ApiKey | null> {
  if (!isFirebaseAvailable()) return null;

  try {
    const db = getDatabase();
    if (!db) return null;

    const newRef = ref(db, `${DB_REF}/${Date.now()}`);
    await set(newRef, api);
    
    return {
      id: newRef.key || Date.now().toString(),
      ...api,
    };
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'API à Firebase:", error);
    return null;
  }
}

// Fonction pour mettre à jour une API
export async function updateApiInFirebase(
  id: string,
  updates: Partial<Omit<ApiKey, "id">>
): Promise<boolean> {
  if (!isFirebaseAvailable()) return false;

  try {
    const db = getDatabase();
    if (!db) return false;

    await set(ref(db, `${DB_REF}/${id}`), updates);
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'API dans Firebase:", error);
    return false;
  }
}

// Fonction pour supprimer une API
export async function deleteApiFromFirebase(id: string): Promise<boolean> {
  if (!isFirebaseAvailable()) return false;

  try {
    const db = getDatabase();
    if (!db) return false;

    await remove(ref(db, `${DB_REF}/${id}`));
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'API de Firebase:", error);
    return false;
  }
}

// Fonction pour rechercher des API
export async function searchApisInFirebase(searchTerm: string, category?: string): Promise<ApiKey[]> {
  if (!isFirebaseAvailable()) return [];

  try {
    const db = getDatabase();
    if (!db) return [];

    // Récupérer toutes les API et filtrer côté client
    const apis = await getAllApisFromFirebase();
    
    return apis.filter((api) => {
      const matchesSearch =
        !searchTerm ||
        api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (api.description && api.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (api.url && api.url.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !category || category === "all" || api.category === category;

      return matchesSearch && matchesCategory;
    });
  } catch (error) {
    console.error("Erreur lors de la recherche d'API dans Firebase:", error);
    return [];
  }
} 