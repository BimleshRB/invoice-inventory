import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface TopProductsProps {
  products: { name: string; quantity: number }[]
}

export function TopProducts({ products }: TopProductsProps) {
  const maxQuantity = Math.max(...products.map((p) => p.quantity), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{product.name}</span>
                <span className="text-muted-foreground">{product.quantity} sold</span>
              </div>
              <Progress value={(product.quantity / maxQuantity) * 100} className="h-2" />
            </div>
          ))}
          {products.length === 0 && <p className="text-sm text-muted-foreground">No sales data yet</p>}
        </div>
      </CardContent>
    </Card>
  )
}
