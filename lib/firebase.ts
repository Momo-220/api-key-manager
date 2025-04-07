"use client"

import type { Database } from "firebase/database"

// Initialisation conditionnelle de Firebase uniquement côté client
let db: Database | undefined = undefined

// Fonction pour initialiser Firebase de manière lazy
export function getDatabase() {
  if (typeof window === "undefined") {
    // Ne pas initialiser côté serveur
    console.log("Firebase: Exécution côté serveur, initialisation ignorée");
    return undefined;
  }

  if (db !== undefined) {
    console.log("Firebase: Déjà initialisé");
    return db;
  }

  try {
    console.log("Firebase: Tentative d'initialisation...");
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

    console.log("Firebase: Configuration chargée", {
      apiKeyExists: !!firebaseConfig.apiKey,
      databaseUrlExists: !!firebaseConfig.databaseURL
    });

    // Vérifier que les variables d'environnement essentielles sont définies
    if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
      console.warn("Variables d'environnement Firebase manquantes");
      return undefined;
    }

    const app = initializeApp(firebaseConfig);
    db = getRealtimeDb(app);
    console.log("Firebase: Realtime Database initialisée avec succès");
    return db;
  } catch (error) {
    console.error("Erreur détaillée lors de l'initialisation de Firebase:", error);
    return undefined;
  }
}

// Fonction pour vérifier si Firebase est disponible
export function isFirebaseAvailable() {
  // Tente d'initialiser la connexion si pas déjà fait
  if (db === undefined && typeof window !== "undefined") {
    getDatabase();
  }
  return typeof window !== "undefined" && db !== undefined;
}

