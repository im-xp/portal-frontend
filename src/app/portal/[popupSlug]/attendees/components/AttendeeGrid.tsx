'use client'

import { AttendeeDirectory } from "@/types/Attendee"
import AttendeeCard from "./AttendeeCard"
import Pagination from "@/components/common/Pagination"
import { Loader2 } from "lucide-react"

type AttendeeGridProps = {
  attendees: AttendeeDirectory[]
  loading: boolean
  totalAttendees: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
}

const AttendeeGrid = ({ 
  attendees, 
  loading, 
  totalAttendees, 
  currentPage, 
  pageSize, 
  onPageChange,
}: AttendeeGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (attendees.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center">
        <p className="text-muted-foreground text-lg">No participants found</p>
        <p className="text-muted-foreground/60 text-sm mt-1">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attendees.map((attendee, index) => (
          <AttendeeCard 
            key={`${attendee.email}-${index}`} 
            attendee={attendee} 
            index={index}
          />
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={Math.ceil(totalAttendees / pageSize)}
        />
      </div>
    </div>
  )
}

export default AttendeeGrid
