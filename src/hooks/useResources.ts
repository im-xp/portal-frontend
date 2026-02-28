import { useApplication } from "@/providers/applicationProvider"
import { useCityProvider } from "@/providers/cityProvider"
import { dynamicForm } from "@/constants"
import { Resource } from "@/types/resources"
import { FileText, Home, Ticket, Users } from "lucide-react"

const useResources = () => {
  const { getCity, getPopups } = useCityProvider()
  const { getRelevantApplication, applications } = useApplication()
  const application = getRelevantApplication()
  const city = getCity()
  const popups = getPopups()

  // Check if data is still loading (providers haven't fetched yet)
  const isLoading = applications === null || popups.length === 0

  const isEdge = city?.slug === 'edge-esmeralda' || city?.slug === 'buenos-aires'
  const applicationAccepted = application?.status === 'accepted'
  const formConfig = dynamicForm[city?.slug ?? ''] ?? dynamicForm['default']
  const canSeeAttendees = applicationAccepted && !!formConfig?.attendeesDirectory

  const resources: Resource[] = [
    {
      name: 'Application',
      icon: FileText,
      status: 'active',
      path: `/portal/${city?.slug}`,
      children: [
        {
          name: 'Status',
          status: 'inactive',
          value: application?.status ?? 'not started'
        }
      ]
    },
    {
      name: 'Passes',
      icon: Ticket,
      status: applicationAccepted ? 'active' : 'disabled',
      path: `/portal/${city?.slug}/passes`,
    },
    {
      name: 'Participant Directory', 
      icon: Users,
      status: canSeeAttendees ? 'active' : 'hidden',
      path: `/portal/${city?.slug}/attendees`,
    },
    // {
    //   name: 'Housing',
    //   icon: Home,
    //   status: isEdgeAustin ? 'hidden' : 'soon' as const
    // }
  ]

  return ({ resources, isLoading })
}
export default useResources