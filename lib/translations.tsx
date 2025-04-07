"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types de langues supportées
export type Language = "fr" | "en"

// Interface pour le contexte de traduction
interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Traductions
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation et titres
    myApiKeys: "Mes Clés API",
    newApi: "Nouvelle API",
    back: "Retour",

    // Actions
    save: "Enregistrer",
    saving: "Enregistrement...",
    delete: "Supprimer",
    edit: "Modifier",
    copy: "Copier",
    show: "Afficher",
    hide: "Masquer",

    // Formulaires
    apiName: "Nom de l'API",
    apiNamePlaceholder: "ex: OpenAI API",
    apiKey: "Clé API",
    apiKeyPlaceholder: "ex: sk_test_1234567890abcdef",
    apiUrl: "URL de l'API",
    apiUrlPlaceholder: "ex: https://api.example.com",
    category: "Catégorie",
    selectCategory: "Sélectionner une catégorie",
    expirationDate: "Date d'expiration (optionnel)",
    description: "Description",
    descriptionPlaceholder: "Décrivez à quoi sert cette API...",

    // Catégories
    categoryAI: "Intelligence Artificielle",
    categoryPayment: "Paiement",
    categoryStorage: "Stockage",
    categoryAnalytics: "Analytique",
    categoryCommunication: "Communication",
    categoryOther: "Autre",
    allCategories: "Toutes les catégories",

    // Pages
    addApi: "Ajouter une nouvelle API",
    addApiDesc: "Enregistrez les détails de votre API pour y accéder facilement plus tard.",
    editApi: "Modifier l'API",
    editApiDesc: "Modifiez les détails de votre API.",

    // Messages
    copied: "Copié !",
    copiedDesc: "{label} a été copié dans le presse-papier.",
    apiAdded: "API ajoutée",
    apiAddedDesc: "Votre API a été ajoutée avec succès.",
    apiUpdated: "API mise à jour",
    apiUpdatedDesc: "Votre API a été mise à jour avec succès.",
    apiDeleted: "API supprimée",
    apiDeletedDesc: "L'API a été supprimée avec succès.",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cette API ?",
    confirmDeleteDesc: "Cette action est irréversible. Vous ne pourrez pas récupérer ces informations.",
    cancel: "Annuler",

    // Erreurs
    error: "Erreur",
    errorAddingApi: "Une erreur est survenue lors de l'ajout de l'API.",
    errorUpdatingApi: "Une erreur est survenue lors de la mise à jour de l'API.",
    errorDeletingApi: "Impossible de supprimer l'API.",
    apiNotFound: "API non trouvée",
    apiNotFoundDesc: "Cette API n'existe pas ou a été supprimée.",

    // État vide
    noApis: "Aucune API enregistrée",
    noApisDesc: "Vous n'avez pas encore enregistré de clés API. Commencez par en ajouter une.",
    addFirstApi: "Ajouter une API",

    // Recherche
    search: "Rechercher une API...",
    clearSearch: "Effacer la recherche",

    // Dates
    createdOn: "Créé le {date}",
    expiresOn: "Expire le {date}",

    // Langue
    language: "Langue",
    french: "Français",
    english: "Anglais",
  },
  en: {
    // Navigation and titles
    myApiKeys: "My API Keys",
    newApi: "New API",
    back: "Back",

    // Actions
    save: "Save",
    saving: "Saving...",
    delete: "Delete",
    edit: "Edit",
    copy: "Copy",
    show: "Show",
    hide: "Hide",

    // Forms
    apiName: "API Name",
    apiNamePlaceholder: "e.g. OpenAI API",
    apiKey: "API Key",
    apiKeyPlaceholder: "e.g. sk_test_1234567890abcdef",
    apiUrl: "API URL",
    apiUrlPlaceholder: "e.g. https://api.example.com",
    category: "Category",
    selectCategory: "Select a category",
    expirationDate: "Expiration Date (optional)",
    description: "Description",
    descriptionPlaceholder: "Describe what this API is used for...",

    // Categories
    categoryAI: "Artificial Intelligence",
    categoryPayment: "Payment",
    categoryStorage: "Storage",
    categoryAnalytics: "Analytics",
    categoryCommunication: "Communication",
    categoryOther: "Other",
    allCategories: "All Categories",

    // Pages
    addApi: "Add a new API",
    addApiDesc: "Save your API details for easy access later.",
    editApi: "Edit API",
    editApiDesc: "Modify your API details.",

    // Messages
    copied: "Copied!",
    copiedDesc: "{label} has been copied to clipboard.",
    apiAdded: "API Added",
    apiAddedDesc: "Your API has been successfully added.",
    apiUpdated: "API Updated",
    apiUpdatedDesc: "Your API has been successfully updated.",
    apiDeleted: "API Deleted",
    apiDeletedDesc: "The API has been successfully deleted.",
    confirmDelete: "Are you sure you want to delete this API?",
    confirmDeleteDesc: "This action is irreversible. You won't be able to recover this information.",
    cancel: "Cancel",

    // Errors
    error: "Error",
    errorAddingApi: "An error occurred while adding the API.",
    errorUpdatingApi: "An error occurred while updating the API.",
    errorDeletingApi: "Could not delete the API.",
    apiNotFound: "API Not Found",
    apiNotFoundDesc: "This API doesn't exist or has been deleted.",

    // Empty state
    noApis: "No APIs Registered",
    noApisDesc: "You haven't registered any API keys yet. Start by adding one.",
    addFirstApi: "Add an API",

    // Search
    search: "Search for an API...",
    clearSearch: "Clear search",

    // Dates
    createdOn: "Created on {date}",
    expiresOn: "Expires on {date}",

    // Language
    language: "Language",
    french: "French",
    english: "English",
  },
}

// Création du contexte
const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Provider pour le contexte
export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr")

  // Charger la langue depuis le localStorage au montage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("api-manager-language") as Language
    if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Fonction pour changer la langue
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("api-manager-language", lang)
  }

  // Fonction de traduction
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const contextValue: TranslationContextType = { language, setLanguage, t };
  return <TranslationContext.Provider value={contextValue}>{children}</TranslationContext.Provider>
}

// Hook pour utiliser les traductions
export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
} 