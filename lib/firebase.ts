// Initialisation conditionnelle de Firebase uniquement côté client
let db = undefined

// Fonction pour initialiser Firebase de manière lazy
export function getFirestore() {
  if (typeof window === "undefined") {
    // Ne pas initialiser côté serveur
    return undefined
  }

  if (db !== undefined) {
    return db
  }

  try {
    // Import dynamique pour éviter les problèmes côté serveur
    const { initializeApp } = require("firebase/app")
    const { getFirestore: getFirestoreDb } = require("firebase/firestore")

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    // Vérifier que les variables d'environnement essentielles sont définies
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn("Variables d'environnement Firebase manquantes")
      return undefined
    }

    const app = initializeApp(firebaseConfig)
    db = getFirestoreDb(app)
    return db
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Firebase:", error)
    return undefined
  }
}

// Fonction pour vérifier si Firebase est disponible
export function isFirebaseAvailable() {
  return typeof window !== "undefined" && db !== undefined
}

