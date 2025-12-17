import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate pr-2">{title}</CardTitle>
        <div className="rounded-md bg-primary/10 p-1.5 sm:p-2 flex-shrink-0">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="text-lg sm:text-2xl font-bold text-foreground truncate">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {trend && (
              <span className={cn("font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
            {description && <span className="truncate">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
