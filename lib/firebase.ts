"use client"

import type { Database } from "firebase/database"

// Initialisation conditionnelle de Firebase uniquement côté client
let db: Database | undefined = undefined

// Fonction pour initialiser Firebase de manière lazy
export function getDatabase() {
  if (typeof window === "undefined") {
    console.log("[Firebase Init] Exécution côté serveur, initialisation ignorée");
    return undefined;
  }

  if (db !== undefined) {
    console.log("[Firebase Init] Base de données déjà initialisée");
    return db;
  }

  try {
    console.log("[Firebase Init] Début de l'initialisation");
    const { initializeApp } = require("firebase/app");
    const { getDatabase: getRealtimeDb } = require("firebase/database");

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    console.log("[Firebase Init] Configuration:", {
      apiKeyExists: !!firebaseConfig.apiKey,
      databaseUrlExists: !!firebaseConfig.databaseURL,
      projectIdExists: !!firebaseConfig.projectId,
      config: firebaseConfig
    });

    if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
      console.warn("[Firebase Init] Variables d'environnement manquantes");
      return undefined;
    }

    console.log("[Firebase Init] Initialisation de l'application Firebase");
    const app = initializeApp(firebaseConfig);
    
    console.log("[Firebase Init] Obtention de la référence à la base de données");
    db = getRealtimeDb(app);
    
    console.log("[Firebase Init] Base de données initialisée avec succès");
    return db;
  } catch (error) {
    console.error("[Firebase Init] Erreur lors de l'initialisation:", error);
    if (error instanceof Error) {
      console.error("[Firebase Init] Message:", error.message);
      console.error("[Firebase Init] Stack:", error.stack);
    }
    return undefined;
  }
}

// Fonction pour vérifier si Firebase est disponible
export function isFirebaseAvailable() {
  console.log("[Firebase Check] Vérification de la disponibilité");
  if (db === undefined && typeof window !== "undefined") {
    console.log("[Firebase Check] Tentative d'initialisation");
    getDatabase();
  }
  const available = typeof window !== "undefined" && db !== undefined;
  console.log("[Firebase Check] Firebase disponible:", available);
  return available;
}

