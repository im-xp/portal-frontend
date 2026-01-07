import { useState, useEffect, useMemo } from "react"
import { api } from "@/api"
import { useCityProvider } from "@/providers/cityProvider"
import { AttendeeDirectory } from "@/types/Attendee"

/**
 * Hook that provides a mapping of attendee IDs to their names
 * @returns An object with the mapping, loading state, and attendees
 */
const useAttendeeMapping = () => {
  const { getCity } = useCityProvider()
  const city = getCity()
  const [attendees, setAttendees] = useState<AttendeeDirectory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchAttendees = async () => {
      if (!city) return
      
      try {
        setIsLoading(true)
        const response = await api.get(`applications/attendees_directory/${city.id}`, {
          params: { limit: 500 }
        })
        
        if (response.status === 200) {
          setAttendees(response.data.items)
        }
      } catch (err) {
        console.error('Error fetching attendees for mapping:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttendees()
  }, [city])
  
  // Create a mapping object {id: name} in a memoized way
  const attendeeMapping = useMemo(() => {
    return attendees.reduce<Record<string, string>>((acc, attendee) => {
      const fullName = [attendee.first_name, attendee.last_name].filter(Boolean).join(' ')
      acc[String(attendee.id)] = fullName || 'Anonymous'
      return acc
    }, {})
  }, [attendees])
  
  return {
    attendeeMapping,
    isLoading,
    attendees
  }
}

export default useAttendeeMapping
