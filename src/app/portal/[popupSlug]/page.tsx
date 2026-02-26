'use client'

import { EventCard } from "@/components/Card/EventCard"
import { EventStatus } from "@/components/Card/EventProgressBar"
import { Loader } from "@/components/ui/Loader"
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
  
  return (
    <section className="container mx-auto">
      <div className="space-y-6 max-w-5xl p-6 mx-auto">
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

