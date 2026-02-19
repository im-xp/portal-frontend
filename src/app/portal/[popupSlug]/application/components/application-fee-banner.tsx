import { Info } from "lucide-react"

interface ApplicationFeeBannerProps {
  amount: number
}

export const ApplicationFeeBanner = ({ amount }: ApplicationFeeBannerProps) => {
  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4"
      role="alert"
      aria-label="Application fee required"
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-blue-900">
          Application fee required
        </p>
        <p className="text-sm text-blue-700">
          A non-refundable fee of <span className="font-semibold">${amount.toFixed(2)} USD</span> is
          required to submit your application. You will be redirected to a secure payment page.
        </p>
      </div>
    </div>
  )
}
