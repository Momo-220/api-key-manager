// Initialisation conditionnelle de Firebase uniquement côté client
import type { Firestore } from "firebase/firestore"

let db: Firestore | undefined = undefined

// Fonction pour initialiser Firebase de manière lazy
export function getFirestore() {
  if (typeof window === "undefined") {
    // Ne pas initialiser côté serveur
    console.log("Firebase: Exécution côté serveur, initialisation ignorée");
    return undefined
  }

  if (db !== undefined) {
    console.log("Firebase: Déjà initialisé");
    return db
  }

  try {
    console.log("Firebase: Tentative d'initialisation...");
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
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    }

    console.log("Firebase: Configuration chargée", {
      apiKeyExists: !!firebaseConfig.apiKey,
      projectIdExists: !!firebaseConfig.projectId
    });

    // Vérifier que les variables d'environnement essentielles sont définies
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn("Variables d'environnement Firebase manquantes")
      return undefined
    }

    const app = initializeApp(firebaseConfig)
    db = getFirestoreDb(app)
    console.log("Firebase: Initialisé avec succès");
    return db
  } catch (error) {
    console.error("Erreur détaillée lors de l'initialisation de Firebase:", error)
    return undefined
  }
}

// Fonction pour vérifier si Firebase est disponible
export function isFirebaseAvailable() {
  // Tente d'initialiser la connexion si pas déjà fait
  if (db === undefined && typeof window !== "undefined") {
    getFirestore();
  }
  return typeof window !== "undefined" && db !== undefined;
}

