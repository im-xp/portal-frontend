'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/api'
import { useCityProvider } from '@/providers/cityProvider'
import { AttendeeDirectory } from '@/types/Attendee'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, MessageCircle, Mail, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Permissions from '@/components/Permissions'
import SocialLinksDisplay from '../components/SocialLinksDisplay'
import { hasSocialLinks } from '../utils/parseSocialLinks'
import { convertToEmbeddableImageUrl } from '../utils/convertImageUrl'

// Helper to format custom_data keys into readable labels
const formatLabel = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// Helper to check if a value is displayable
const isDisplayable = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim() !== '' && value !== 'TBD' && value !== 'placeholder'
}

const ProfilePage = () => {
  const params = useParams()
  const router = useRouter()
  const { getCity } = useCityProvider()
  const city = getCity()
  
  const attendeeId = params.attendeeId as string
  const popupSlug = params.popupSlug as string
  
  const [attendee, setAttendee] = useState<AttendeeDirectory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAttendee = async () => {
      if (!city) return
      
      try {
        setLoading(true)
        // Fetch the attendees directory and find the specific one
        const response = await api.get(`applications/attendees_directory/${city.id}`, {
          params: { limit: 500 }
        })
        
        if (response.status === 200) {
          const found = response.data.items.find(
            (a: AttendeeDirectory) => a.id === parseInt(attendeeId)
          )
          if (found) {
            setAttendee(found)
          } else {
            setError('Participant not found')
          }
        }
      } catch (err) {
        console.error('Error fetching attendee:', err)
        setError('Failed to load participant')
      } finally {
        setLoading(false)
      }
    }

    fetchAttendee()
  }, [city, attendeeId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !attendee) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
        <p className="text-muted-foreground text-lg">{error || 'Participant not found'}</p>
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  const fullName = [attendee.first_name, attendee.last_name].filter(Boolean).join(' ')
  const initials = [attendee.first_name?.[0], attendee.last_name?.[0]].filter(Boolean).join('').toUpperCase()
  
  // Get profile image - prefer custom_data headshot_url
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
  
  // Get bio from custom_data or fallback fields
  const bio = attendee.custom_data?.short_bio || attendee.personal_goals || attendee.builder_description
  
  const getTelegramLink = (telegram: string | null) => {
    if (!telegram) return null
    const handle = telegram.startsWith('@') ? telegram.slice(1) : telegram
    return `https://t.me/${handle}`
  }

  // Get custom data entries to display (excluding headshot_url and short_bio which are shown elsewhere)
  const customDataEntries = attendee.custom_data 
    ? Object.entries(attendee.custom_data).filter(
        ([key, value]) => 
          key !== 'headshot_url' && 
          key !== 'short_bio' && 
          isDisplayable(value)
      )
    : []

  return (
    <Permissions>
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/portal/${popupSlug}/attendees`)}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-8 bg-card text-card-foreground">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Avatar */}
              <Avatar className="w-32 h-32 ring-4 ring-primary/20 mx-auto md:mx-0">
                {profileImage ? (
                  <AvatarImage 
                    src={profileImage} 
                    alt={fullName}
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-3xl">
                  {initials || '?'}
                </AvatarFallback>
              </Avatar>
              
              {/* Name & Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {fullName || 'Anonymous'}
                </h1>
                
                {attendee.role && (
                  <p className="text-lg text-primary font-medium mb-1">
                    {attendee.role}
                  </p>
                )}
                
                {attendee.organization && (
                  <p className="text-muted-foreground mb-3">
                    {attendee.organization}
                  </p>
                )}
                
                {/* Location */}
                {attendee.residence && (
                  <div className="flex items-center gap-2 text-muted-foreground justify-center md:justify-start">
                    <MapPin className="w-4 h-4" />
                    <span>{attendee.residence}</span>
                  </div>
                )}
                
                {/* Contact Links */}
                <div className="flex items-center gap-4 mt-4 justify-center md:justify-start flex-wrap">
                  {attendee.email && (
                    <a
                      href={`mailto:${attendee.email}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{attendee.email}</span>
                    </a>
                  )}
                  
                  {attendee.telegram && (
                    <a
                      href={getTelegramLink(attendee.telegram) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{attendee.telegram.startsWith('@') ? attendee.telegram : `@${attendee.telegram}`}</span>
                    </a>
                  )}
                </div>
                
                {/* Social Media Links */}
                {attendee.social_media && (
                  <div className="mt-4">
                    <SocialLinksDisplay text={attendee.social_media} />
                  </div>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {bio && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
                <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {bio}
                </p>
              </div>
            )}

            {/* Custom Data Sections */}
            {customDataEntries.length > 0 && (
              <div className="space-y-6">
                {customDataEntries.map(([key, value]) => (
                  <div key={key}>
                    <h2 className="text-lg font-semibold text-foreground mb-2">
                      {formatLabel(key)}
                    </h2>
                    {hasSocialLinks(value) ? (
                      <SocialLinksDisplay text={value} />
                    ) : (
                      <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                        {value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Additional Standard Fields */}
            {(attendee.age || attendee.gender) && (
              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  {attendee.age && (
                    <div>
                      <span className="font-medium">Age:</span> {attendee.age}
                    </div>
                  )}
                  {attendee.gender && (
                    <div>
                      <span className="font-medium">Gender:</span> {attendee.gender}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </Permissions>
  )
}

export default ProfilePage
