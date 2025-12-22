import { api } from "@/api"
import { useCityProvider } from "@/providers/cityProvider"
import { PopupsProps } from "@/types/Popup"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import useAuthentication from "./useAuthentication"
import { usePopupSlug } from "./usePopupSlug"

type UseGetPopups = {
  getPopupsApi: () => Promise<void>
}

const useGetPopups = (): UseGetPopups => {
  const { setPopups } = useCityProvider()
  const { logout } = useAuthentication()
  const router = useRouter()
  const { popupSlug: pathPopupSlug } = useParams()
  const pathname = usePathname()
  
  // Also check query param/cookie for popup slug (set by middleware for domain-based routing)
  const queryPopupSlug = usePopupSlug()

  const findValidCity = (cities: PopupsProps[], slug?: string) => {
    return cities.find(city => 
      city.clickable_in_portal && 
      city.visible_in_portal && 
      (slug ? city.slug === slug : true)
    )
  }

  const getPopupsApi = async () => {
    try{
      const response = await api.get('popups')
      if (response.status === 200) {
        const cities = response.data as PopupsProps[]
        setPopups(cities.reverse())

        if(pathname === '/portal/poaps') {
          return
        }

        // First check path-based popup slug, then query param/cookie from middleware
        const effectivePopupSlug = (pathPopupSlug as string) || queryPopupSlug
        
        if(!effectivePopupSlug || !findValidCity(cities, effectivePopupSlug)){
          const selectedCity = findValidCity(cities)
          if (selectedCity) router.push(`/portal/${selectedCity.slug}`)
        } else if (!pathPopupSlug && queryPopupSlug && findValidCity(cities, queryPopupSlug)) {
          // User is on /portal but came from a specific domain - redirect to that popup
          router.push(`/portal/${queryPopupSlug}`)
        }
      }
    } catch(err: any) {
      if(err.response?.status === 401) {
        logout()
      }
    }
  }

  useEffect(() => {
    getPopupsApi()
  }, [])

  return {
    getPopupsApi
  }
}

export default useGetPopups