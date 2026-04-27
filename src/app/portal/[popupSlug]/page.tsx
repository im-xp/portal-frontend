'use client'

import { EventCard } from "@/components/Card/EventCard"
import { EventStatus } from "@/components/Card/EventProgressBar"
import { Loader } from "@/components/ui/Loader"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { dynamicForm } from "@/constants"
import { useApplication } from "@/providers/applicationProvider"
import { useCityProvider } from "@/providers/cityProvider"
import { api } from "@/api"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import useGetApplications from "@/hooks/useGetApplications"

export default function Home() {
  const { getCity } = useCityProvider()
  const { getRelevantApplication, updateApplication } = useApplication()
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingFee, setIsProcessingFee] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSubmittingRef = useRef(false)
  const getApplicationsApi = useGetApplications(false)
  const getApplicationsApiRef = useRef(getApplicationsApi)
  getApplicationsApiRef.current = getApplicationsApi
  const city = getCity()
  const relevantApplication = getRelevantApplication()

  const handleAutoSubmit = useCallback(async (applicationId: number) => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    try {
      const response = await api.put(`applications/${applicationId}`, { status: 'in review' })
      if (response.status === 200 || response.status === 201) {
        updateApplication(response.data)
        toast.success("Application Submitted", {
          description: "Your application has been successfully submitted.",
        })
      } else {
        toast.error("Error", {
          description: "Could not submit your application. Please try again.",
        })
      }
    } catch {
      toast.error("Error", {
        description: "Could not submit your application. Please try again.",
      })
    } finally {
      setIsProcessingFee(false)
      router.replace(`/portal/${city?.slug}`, { scroll: false })
    }
  }, [city?.slug, router, updateApplication])

  useEffect(() => {
    if (searchParams.get('fee_paid') !== 'true') return
    setIsProcessingFee(true)
  }, [searchParams])

  useEffect(() => {
    if (!isProcessingFee || relevantApplication?.application_fee_paid) return

    const timeoutId = setTimeout(() => {
      getApplicationsApiRef.current()
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [isProcessingFee, relevantApplication])

  useEffect(() => {
    if (!isProcessingFee || !relevantApplication?.application_fee_paid) return
    handleAutoSubmit(relevantApplication.id)
  }, [isProcessingFee, relevantApplication?.application_fee_paid, handleAutoSubmit, relevantApplication?.id])
  
  if(!city && !relevantApplication) return null

  const onClickApply = () => {
    if(relevantApplication?.status === 'accepted') {
      router.push(`/portal/${city?.slug}/passes`)
      return;
    }
    setIsLoading(true)
    router.push(`/portal/${city?.slug}/application`)
  }
  
  if(isLoading) return <Loader />
  
  const canApply = dynamicForm[city?.slug ?? ''] !== null
  const showWorkExchangeGraphic = city?.slug === 'iceland-eclipse-volunteers' 

  return (
    <section className="container mx-auto">
      <div className="space-y-6 max-w-5xl p-6 mx-auto">
        {showWorkExchangeGraphic && (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Work Exchange Program
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <div className="overflow-x-auto rounded-xl w-full cursor-zoom-in group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/work_exchange_program.jpg"
                    alt="Work Exchange options table showing Long Build, Short Build, Event, and Post-Event options with arrival dates, work requirements, accommodations, transportation, and meals details"
                    className="w-[600px] max-w-full h-auto mx-auto border border-border transition-opacity group-hover:opacity-90"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-5xl max-h-[95vh] overflow-auto p-2 sm:p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/work_exchange_program.jpg"
                  alt="Work Exchange options table showing Long Build, Short Build, Event, and Post-Event options with arrival dates, work requirements, accommodations, transportation, and meals details"
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
        <EventCard
          {...city!}
          onApply={onClickApply}
          status={relevantApplication?.status as EventStatus}
          canApply={canApply}
          loading={isProcessingFee}
        />
      </div>
    </section>
  )
}

