import { Loader2 } from "lucide-react"
import { BreadcrumbItem, BreadcrumbLink } from "../ui/breadcrumb"

interface BreadcrumbSegmentProps {
  path: string
  prevPath?: string
  isLoadingGroups?: boolean
  isLoadingAttendees?: boolean
  groupMapping?: Record<string, string>
  attendeeMapping?: Record<string, string>
}

const BreadcrumbSegment = ({ 
  path, 
  prevPath,
  isLoadingGroups, 
  isLoadingAttendees,
  groupMapping,
  attendeeMapping 
}: BreadcrumbSegmentProps) => {
  // Check if this is a group ID (when previous path is "groups")
  const isGroupId = prevPath === 'groups' && groupMapping && Object.keys(groupMapping).includes(path)
  
  // Check if this is an attendee ID (when previous path is "attendees")
  const isAttendeeId = prevPath === 'attendees' && attendeeMapping && Object.keys(attendeeMapping).includes(path)
  
  // Determine display text
  let displayText = path
  if (isGroupId) {
    displayText = groupMapping![path]
  } else if (isAttendeeId) {
    displayText = attendeeMapping![path]
  }
  
  // Capitalize first letter for regular paths
  const formattedText = typeof displayText === 'string' && !isGroupId && !isAttendeeId
    ? displayText.charAt(0).toUpperCase() + displayText.slice(1) 
    : displayText

  // Determine if loading
  const isLoading = (isLoadingGroups && isGroupId) || (isLoadingAttendees && isAttendeeId)

  return (
    <BreadcrumbItem>
      {isLoading ? (
        <div className="flex items-center">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          <BreadcrumbLink>Loading...</BreadcrumbLink>
        </div>
      ) : (
        <BreadcrumbLink>{formattedText}</BreadcrumbLink>
      )}
    </BreadcrumbItem>
  )
}

export default BreadcrumbSegment 