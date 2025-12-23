"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import useGetApplications from "@/hooks/useGetApplications"
import { getPopupBranding } from "@/constants/popupBranding"
import { PopupTheme } from "@/components/PopupTheme"
import { Suspense } from "react"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const popupSlug = searchParams.get('popup')
  const branding = getPopupBranding(popupSlug)
  const getApplication = useGetApplications()

  useEffect(() => {
    const fetchApplication = async () => {
      await getApplication()
    }
    fetchApplication()
  }, []);

  const handleGoToPortal = () => {
    router.push(popupSlug ? `/portal/${popupSlug}` : "/portal")
  }

  return (
    <PopupTheme colors={branding.colors}>
      <div 
        className="min-h-screen w-full py-12 flex items-center justify-center"
        style={{
          backgroundImage: `url('${branding.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <motion.div 
          className="container max-w-xl mx-auto bg-card/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-card-foreground">Tickets Purchased!</h1>
              <p className="mt-2 text-muted-foreground">
                Thank you for joining us at {branding.name}. Your tickets are ready for use. We look forward to co-creating with you!
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleGoToPortal}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Home className="mr-2 h-4 w-4" />
                Go back to {branding.name.includes('Portal') ? 'The Portal' : branding.name}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </PopupTheme>
  )
}

const SuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

export default SuccessPage
