'use client'

import { AttendeeDirectory } from "@/types/Attendee"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { SocialLinksInline } from "./SocialLinksDisplay"
import { convertToEmbeddableImageUrl } from "../utils/convertImageUrl"

interface AttendeeCardProps {
  attendee: AttendeeDirectory
  index: number
}

const AttendeeCard = ({ attendee, index }: AttendeeCardProps) => {
  const params = useParams()
  const popupSlug = params.popupSlug as string
  
  const fullName = [attendee.first_name, attendee.last_name].filter(Boolean).join(' ')
  const initials = [attendee.first_name?.[0], attendee.last_name?.[0]].filter(Boolean).join('').toUpperCase()
  
  // Get profile image - prefer custom_data headshot_url, fall back to picture_url
  // Convert cloud storage share links to embeddable URLs
  const getProfileImage = () => {
    const headshotUrl = attendee.custom_data?.headshot_url
    if (headshotUrl) {
      const converted = convertToEmbeddableImageUrl(headshotUrl)
      if (converted) return converted
    }
    return attendee.picture_url
  }
  
  const profileImage = getProfileImage()
  
  // Get bio - prefer custom_data short_bio, fall back to personal_goals or builder_description
  const getBio = () => {
    return attendee.custom_data?.short_bio || attendee.personal_goals || attendee.builder_description
  }
  
  const bio = getBio()
  
  // Get telegram link
  const getTelegramLink = (telegram: string | null) => {
    if (!telegram) return null
    const handle = telegram.startsWith('@') ? telegram.slice(1) : telegram
    return `https://t.me/${handle}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/portal/${popupSlug}/attendees/${attendee.id}`}>
        <Card className="p-5 bg-card text-card-foreground h-full flex flex-col hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-border/50 cursor-pointer">
          {/* Header: Avatar + Name/Title */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-16 h-16 ring-2 ring-primary/20">
              {profileImage ? (
                <AvatarImage 
                  src={profileImage} 
                  alt={fullName}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {initials || '?'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {fullName || 'Anonymous'}
              </h3>
              {attendee.role && (
                <p className="text-sm text-primary font-medium truncate">
                  {attendee.role}
                </p>
              )}
              {attendee.organization && (
                <p className="text-sm text-muted-foreground truncate">
                  {attendee.organization}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          {attendee.residence && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{attendee.residence}</span>
            </div>
          )}

          {/* Bio */}
          {bio && (
            <p className="text-sm text-foreground/80 mb-4 line-clamp-3 flex-grow">
              {bio}
            </p>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/50">
            {attendee.telegram && (
              <span
                onClick={(e) => {
                  e.preventDefault()
                  window.open(getTelegramLink(attendee.telegram) || '#', '_blank')
                }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                title={`Telegram: ${attendee.telegram}`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="truncate max-w-[80px]">
                  {attendee.telegram.startsWith('@') ? attendee.telegram : `@${attendee.telegram}`}
                </span>
              </span>
            )}
            
            <SocialLinksInline text={attendee.social_media} />
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

export default AttendeeCard
