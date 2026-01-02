import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Medal, Newspaper, LogOut } from "lucide-react"
import InvoiceModal from "@/app/portal/[popupSlug]/passes/components/common/InvoiceModal"
import useAuthentication from "@/hooks/useAuthentication"

const HeaderProfile = () => {
  const router = useRouter()
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const { logout } = useAuthentication()


  return (
    <div className="p-6 border-b border-border bg-card text-card-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your Edge experience and history</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-foreground border-border bg-transparent hover:bg-accent" onClick={ () => router.push('/portal/poaps')}>
              <Medal className="mr-2 size-4" />
              My Collectibles
            </Button>
            {/* <Button variant="outline" className="text-foreground border-border hover:bg-accent bg-transparent">
              My Referrals
            </Button> */}
            <Button variant="outline" className="text-foreground border-border hover:bg-accent bg-transparent" onClick={() => setIsInvoiceModalOpen(true)}>
              <Newspaper className="h-4 w-4" />
              Invoices
            </Button>
            <InvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} />
            
            <div className="h-6 w-px bg-border" />

            <Button variant="outline" className="text-foreground border-border hover:bg-accent bg-transparent" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
  )
}
export default HeaderProfile