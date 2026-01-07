import { ChevronRight } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb"
import { SidebarTrigger } from "./SidebarComponents"
import { useCityProvider } from "@/providers/cityProvider"
import { usePathname, useRouter } from 'next/navigation'
import { Fragment } from "react"
import useGroupMapping from "./hooks/useGroupMapping"
import useAttendeeMapping from "./hooks/useAttendeeMapping"
import BreadcrumbSegment from "./BreadcrumbSegment"

const HeaderBar = () => {
  const { getCity } = useCityProvider()
  const pathname = usePathname()
  const city = getCity()
  const router = useRouter()
  const { groupMapping, isLoading: isLoadingGroups } = useGroupMapping()
  const { attendeeMapping, isLoading: isLoadingAttendees } = useAttendeeMapping()
  
  const handleClickCity = () => {
    router.push(`/portal/${city?.slug}`)
  }
  
  // Procesar la ruta
  const pathSegments = pathname.split('/').filter(Boolean).slice(2) // Eliminar los dos primeros elementos
  const pathsToDisplay = pathSegments.length > 0 ? pathSegments : ['application']

  

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card text-card-foreground px-6 w-[100%]">
      <SidebarTrigger />
      <Breadcrumb>
        <BreadcrumbList className="text-card-foreground">
          <BreadcrumbItem>
            <BreadcrumbPage className="cursor-pointer" onClick={handleClickCity}>
              {city?.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
  
          {pathsToDisplay.map((path, index) => (
            <Fragment key={index}>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbSegment 
                path={path} 
                prevPath={pathsToDisplay[index - 1]}
                isLoadingGroups={isLoadingGroups}
                isLoadingAttendees={isLoadingAttendees}
                groupMapping={groupMapping}
                attendeeMapping={attendeeMapping}
              />
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}

export default HeaderBar