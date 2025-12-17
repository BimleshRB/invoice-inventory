import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ActivityLog } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { Package, FileText, Users, ArrowUpDown } from "lucide-react"

interface RecentActivityProps {
  activities: ActivityLog[]
}

const iconMap = {
  product: Package,
  invoice: FileText,
  customer: Users,
  stock: ArrowUpDown,
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => {
            const Icon = iconMap[activity.entityType] || Package
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="rounded-md bg-muted p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.entityType}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
