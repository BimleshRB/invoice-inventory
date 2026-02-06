import type React from "react"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollToTop } from "@/components/scroll-to-top"
import "./globals.css"
import { generateOrganizationSchema, asJsonLd } from "@/lib/seo"
import { dataStore } from "@/lib/store"

// Using system fonts as fallback when Google Fonts is unavailable
const inter = { variable: "--font-inter" }
const geistMono = { variable: "--font-geist-mono" }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "InventoryFlow - Smart Inventory & Invoice Management",
  description:
    "Professional inventory and invoice management system for modern businesses. Track products, manage stock, create invoices, and analyze sales.",
  keywords: ["inventory management", "invoice", "stock tracking", "business", "sales"],
  authors: [{ name: "InventoryFlow" }],
  generator: "v0.app",
  openGraph: {
    title: "InventoryFlow - Smart Inventory & Invoice Management",
    description:
      "Professional inventory and invoice management system for modern businesses. Track products, manage stock, create invoices, and analyze sales.",
    url: SITE_URL,
    siteName: "InventoryFlow",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "InventoryFlow",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InventoryFlow - Smart Inventory & Invoice Management",
    description:
      "Professional inventory and invoice management system for modern businesses. Track products, manage stock, create invoices, and analyze sales.",
    images: [`${SITE_URL}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Server-side: build organization JSON-LD from in-memory store
  const store = dataStore.getStore()
  const orgSchema = generateOrganizationSchema({
    name: store.name,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
    logo: store.logo ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"}/og-image.png`,
    telephone: store.phone,
    address: {
      street: store.address,
      city: "",
      country: "",
    },
  })

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: asJsonLd(orgSchema) }} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
