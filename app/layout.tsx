import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TranslationProvider } from "@/lib/translations"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SplashScreen } from "@/components/splash-screen"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "API Manager",
  description: "Gérez facilement vos clés API en toute sécurité",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-background to-gray-950 dark:from-background dark:to-gray-950 light:from-gray-50 light:to-gray-200`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} storageKey="api-manager-theme">
          <TranslationProvider>
            <SplashScreen />
            <div className="flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
            <Toaster />
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'