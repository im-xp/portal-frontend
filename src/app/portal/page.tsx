"use client"

import { Loader } from "@/components/ui/Loader"
import { useCityProvider } from "@/providers/cityProvider"
import { usePopupSlug } from "@/hooks/usePopupSlug"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
  const { getCity } = useCityProvider()
  const city = getCity()
  const router = useRouter()
  const params = useSearchParams()
  const queryPopupSlug = params.get('popup')
  const cookiePopupSlug = usePopupSlug()
  const popupSlug = queryPopupSlug || cookiePopupSlug

  useEffect(() => {
    if(popupSlug){
      router.push(`/portal/${popupSlug}`)
      return
    }

    if(city?.slug){
      router.push(`/portal/${city.slug}`)
    }
  }, [city, popupSlug, router])

  return (
    <div className="w-full h-full">
      <Loader/>
    </div>
  )
}
export default Page
