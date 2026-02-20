import { api } from "@/api"
import { useApplication } from "@/providers/applicationProvider"
import { useCityProvider } from "@/providers/cityProvider"
import { useState } from "react"

interface FeePaymentResponse {
  checkout_url: string
  status: string
  id: number
  amount: number
  currency: string
}

const useApplicationFee = () => {
  const [loading, setLoading] = useState(false)
  const { getCity } = useCityProvider()
  const { getRelevantApplication } = useApplication()

  const city = getCity()
  const application = getRelevantApplication()

  const applicationFee = city?.application_fee ?? 0
  const hasApplicationFee = applicationFee > 0
  const isFeePaid = application?.application_fee_paid ?? false

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
    loading,
    createFeePayment,
  }
}

export default useApplicationFee
