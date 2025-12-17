import { NextResponse } from "next/server"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"

export async function GET() {
  // Static pages to include in sitemap. Add dynamic entries here as needed.
  import { NextResponse } from "next/server"
  import { dataStore } from "@/lib/store"

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"

  export async function GET() {
    // Static pages to include in sitemap. Add dynamic entries here as needed.
    const pages = [
      "",
      "about",
      "contact",
      "demo",
      "press",
      "blog",
      "changelog",
      "careers",
      "status",
      "community",
      "partners",
      "dashboard",
    ]

    const productUrls = dataStore.getProducts().map((p) => ({ loc: `${SITE_URL}/products/${p.id}`, lastmod: p.updatedAt || p.createdAt }))
    const invoiceUrls = dataStore.getInvoices().map((i) => ({ loc: `${SITE_URL}/invoices/${i.id}`, lastmod: i.updatedAt || i.createdAt }))

    const staticUrls = pages.map((p) => ({ loc: `${SITE_URL}/${p}`.replace(/([^:]\/\/)\/$/, "$1"), lastmod: new Date() }))

    const all = [...staticUrls, ...productUrls, ...invoiceUrls]

    const urls = all
      .map(
        (u) => `\n    <url>\n      <loc>${u.loc}</loc>\n      <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.8</priority>\n    </url>`
      )
      .join("")

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n  </urlset>`

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml" },
    })
  }
