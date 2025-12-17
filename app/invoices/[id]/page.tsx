import React from "react"
import { dataStore } from "@/lib/store"
import { notFound } from "next/navigation"
import { formatCurrency } from "@/lib/i18n"

type Props = { params: { id: string } }

export async function generateMetadata({ params }: Props) {
  const invoice = dataStore.getInvoice(params.id)
  if (!invoice) return { title: "Invoice not found" }
  return {
    title: `${invoice.invoiceNumber} — ${formatCurrency(invoice.total)}`,
    description: `Invoice ${invoice.invoiceNumber} for ${invoice.customer?.name || 'customer'}`,
    openGraph: { title: invoice.invoiceNumber, description: invoice.notes || '' },
  }
}

export default function InvoicePage({ params }: Props) {
  const invoice = dataStore.getInvoice(params.id)
  if (!invoice) return notFound()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2">{invoice.invoiceNumber}</h1>
      <p className="text-sm text-muted-foreground mb-4">{invoice.customer?.name}</p>
      <div className="prose">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((it) => (
              <tr key={it.id}>
                <td>{it.product?.name || it.productId}</td>
                <td>{it.quantity}</td>
                <td>{it.product?.unit || '-'}</td>
                <td className="text-right">{formatCurrency(it.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-right">
          <p>
            <strong>Subtotal:</strong> {formatCurrency(invoice.subtotal)}
          </p>
          <p>
            <strong>Tax:</strong> {formatCurrency(invoice.taxAmount)}
          </p>
          <p>
            <strong>Total:</strong> {formatCurrency(invoice.total)}
          </p>
        </div>
      </div>
    </div>
  )
}
