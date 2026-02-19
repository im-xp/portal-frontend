import { api } from "@/api"
import { useApplication } from "@/providers/applicationProvider"
import { useCityProvider } from "@/providers/cityProvider"
import { PaymentsProps } from "@/types/passes"
import { useCallback, useEffect, useState } from "react"

interface FeePaymentResponse {
  checkout_url: string
  status: string
  id: number
  amount: number
  currency: string
}

const useApplicationFee = () => {
  const [isFeePaid, setIsFeePaid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingFee, setCheckingFee] = useState(false)
  const { getCity } = useCityProvider()
  const { getRelevantApplication } = useApplication()

  const city = getCity()
  const application = getRelevantApplication()

  const applicationFee = city?.application_fee ?? 0
  const hasApplicationFee = applicationFee > 0

  const checkFeePaid = useCallback(async () => {
    if (!application || !hasApplicationFee) return

    setCheckingFee(true)
    try {
      const response = await api.get(`payments?application_id=${application.id}`)
      if (response.status === 200) {
        const payments: PaymentsProps[] = response.data
        const approvedFee = payments.some(
          (p) => p.is_application_fee && p.status === "approved"
        )
        setIsFeePaid(approvedFee)
      }
    } catch {
      console.error("Error checking application fee status")
    } finally {
      setCheckingFee(false)
    }
  }, [application, hasApplicationFee])

  useEffect(() => {
    checkFeePaid()
  }, [checkFeePaid])

  const createFeePayment = async (
    applicationId: number
  ): Promise<FeePaymentResponse | null> => {
    setLoading(true)
    try {
      const response = await api.post("payments/application-fee", {
        application_id: applicationId,
      })

      if (response.status === 200) {
        return response.data as FeePaymentResponse
      }

      const detail = response?.data?.detail
      if (detail) {
        return Promise.reject(new Error(detail))
      }

      return null
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    hasApplicationFee,
    applicationFee,
    isFeePaid,
    checkingFee,
    loading,
    createFeePayment,
    checkFeePaid,
  }
}

export default useApplicationFee
