import type { Metadata } from "next"
import { Inter, IBM_Plex_Mono, Inconsolata, Lato } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex-mono" })
const inconsolata = Inconsolata({ subsets: ["latin"], variable: "--font-inconsolata" })
const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-lato" })

const DESCRIPTION =
  "Amber Studio is an engineering studio in Accra, Ghana. We design and build websites, " +
  "custom software and the operations systems businesses actually run on — built for real " +
  "conditions: intermittent power, expensive data, cheap Android phones."

export const metadata: Metadata = {
  title: "Amber Studio — Engineering real-world solutions",
  description: DESCRIPTION,
  openGraph: {
    title: "Amber Studio — Engineering real-world solutions",
    description: DESCRIPTION,
    type: "website",
  },
  // No OG image yet: the studio's own mark is shot in the Phase 0 session, and a
  // link preview with no picture beats one pointing at a missing file.
  twitter: {
    card: "summary",
    title: "Amber Studio — Engineering real-world solutions",
    description: DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "font-sans",
        inter.variable,
        plexMono.variable,
        inconsolata.variable,
        lato.variable,
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
