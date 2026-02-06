import React from "react"
import { dataStore } from "@/lib/store"
import { notFound } from "next/navigation"
import { formatCurrency } from "@/lib/i18n"

type Props = { params: { id: string } }

export async function generateMetadata({ params }: Props) {
  const product = dataStore.getProduct(params.id)
  if (!product) return { title: "Product not found" }
  return {
    title: `${product.name} — ${formatCurrency(product.sellingPrice)}`,
    description: product.description || `Details for ${product.name}`,
    openGraph: { title: product.name, description: product.description },
  }
}

export default function ProductPage({ params }: Props) {
  const product = dataStore.getProduct(params.id)
  if (!product) return notFound()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-sm text-muted-foreground mb-4">{product.category?.name}</p>
      <div className="prose">
        <p>{product.description}</p>
        <p>
          <strong>Price:</strong> {formatCurrency(product.sellingPrice)}
        </p>
        <p>
          <strong>Unit:</strong> {product.unit}
        </p>
        {product.expiryDate && (
          <p>
            <strong>Expiry:</strong> {new Date(product.expiryDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}
