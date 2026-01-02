import { CitizenProfile } from "@/types/Profile"
import { MapPinned, Speech, Calendar1 } from "lucide-react"
import { Card } from "../ui/card"

const StatsCards = ({userData}: {userData: CitizenProfile | null}) => {
  const currentDate = new Date()
  
  // Filter only popups that have already ended
  const completedPopups = userData?.popups?.filter(popup => {
    const endDate = new Date(popup.end_date)
    return endDate < currentDate
  }) ?? []

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Pop-ups attended</p>
            <p className="text-3xl font-bold text-foreground">{completedPopups.length}</p>
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <MapPinned className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Days at The Portal</p>
            <p className="text-3xl font-bold text-foreground">{userData?.total_days ?? 0}</p>
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <Calendar1 className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Referrals</p>
            <p className="text-3xl font-bold text-foreground">{userData?.referral_count ?? 0}</p>
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <Speech className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>
    </div>
  )
}
export default StatsCards