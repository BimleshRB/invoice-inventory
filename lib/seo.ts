export const SITE_DEFAULTS = {
  siteName: "InventoryFlow",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  description:
    "Professional inventory and invoice management system for modern businesses. Track products, manage stock, create invoices, and analyze sales.",
}

export function generateOpenGraph({ title, description, url, image }: { title: string; description: string; url?: string; image?: string }) {
  const siteUrl = SITE_DEFAULTS.siteUrl
  return {
    title,
    description,
    url: url ?? siteUrl,
    images: [image ?? `${siteUrl}/og-image.png`],
  }
}

export function generateOrganizationSchema(opts: {
  name: string
  url?: string
  logo?: string
  telephone?: string
  address?: { street: string; city: string; region?: string; postalCode?: string; country?: string }
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: opts.name,
    url: opts.url ?? SITE_DEFAULTS.siteUrl,
  }

  if (opts.logo) schema.logo = opts.logo
  if (opts.telephone) schema.telephone = opts.telephone
  if (opts.address)
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: opts.address.street,
      addressLocality: opts.address.city,
      addressRegion: opts.address.region,
      postalCode: opts.address.postalCode,
      addressCountry: opts.address.country,
    }

  return schema
}

export function asJsonLd(obj: object) {
  return JSON.stringify(obj)
}
