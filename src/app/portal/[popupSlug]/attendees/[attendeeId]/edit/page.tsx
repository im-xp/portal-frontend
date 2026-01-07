'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/api'
import { useCityProvider } from '@/providers/cityProvider'
import { useApplication } from '@/providers/applicationProvider'
import useGetTokenAuth from '@/hooks/useGetTokenAuth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { dynamicForm, CustomField } from '@/constants'
import Permissions from '@/components/Permissions'

import InputForm from '@/components/ui/Form/Input'
import TextAreaForm from '@/components/ui/Form/TextArea'
import SelectForm from '@/components/ui/Form/Select'
import SectionWrapper from '../../../application/components/SectionWrapper'

const EditProfilePage = () => {
  const params = useParams()
  const router = useRouter()
  const { getCity } = useCityProvider()
  const { user } = useGetTokenAuth()
  const { getRelevantApplication, updateApplication } = useApplication()
  const city = getCity()

  const attendeeId = params.attendeeId as string
  const popupSlug = params.popupSlug as string

  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [applicationId, setApplicationId] = useState<number | null>(null)

  const form = dynamicForm[city?.slug ?? '']
  const customFields = form?.customFields ?? []

  useEffect(() => {
    const fetchApplication = async () => {
      if (!city || !user) return

      try {
        setLoading(true)

        // First try to get from context
        const existingApp = getRelevantApplication()

        if (existingApp && existingApp.id === parseInt(attendeeId)) {
          // Verify ownership (convert to string for comparison)
          if (String(existingApp.citizen_id) !== String(user.citizen_id)) {
            setError('You can only edit your own profile')
            return
          }
          initializeFormData(existingApp)
          setApplicationId(existingApp.id)
          setLoading(false)
          return
        }

        // Fallback: fetch from API
        const response = await api.get(`applications/${attendeeId}`)

        if (response.status === 200) {
          const application = response.data

          if (String(application.citizen_id) !== String(user.citizen_id)) {
            setError('You can only edit your own profile')
            return
          }

          initializeFormData(application)
          setApplicationId(application.id)
        }
      } catch (err) {
        console.error('Error fetching application:', err)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [city, user, attendeeId])

  // Update page title when form data loads
  useEffect(() => {
    if (formData.first_name || formData.last_name) {
      const fullName = [formData.first_name, formData.last_name].filter(Boolean).join(' ')
      document.title = `Edit ${fullName}` || 'Edit Profile'
    }
  }, [formData.first_name, formData.last_name])

  const initializeFormData = (application: any) => {
    const data: Record<string, any> = {
      first_name: application.first_name ?? '',
      last_name: application.last_name ?? '',
      telegram: application.telegram ?? '',
      organization: application.organization ?? '',
      role: application.role ?? '',
      residence: application.residence ?? '',
      social_media: application.social_media ?? '',
      age: application.age ?? '',
      gender: application.gender ?? '',
      personal_goals: application.personal_goals ?? '',
      builder_description: application.builder_description ?? '',
    }

    // Extract custom_data fields with custom_ prefix
    if (application.custom_data && typeof application.custom_data === 'object') {
      for (const [key, value] of Object.entries(application.custom_data)) {
        data[`custom_${key}`] = value
      }
    }

    setFormData(data)
  }

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!applicationId) return

    setSaving(true)

    try {
      // Separate standard fields from custom fields
      const customData: Record<string, unknown> = {}
      const standardData: Record<string, unknown> = {}

      for (const [key, value] of Object.entries(formData)) {
        if (key.startsWith('custom_')) {
          const customKey = key.replace('custom_', '')
          customData[customKey] = value
        } else {
          standardData[key] = value
        }
      }

      const payload = {
        ...standardData,
        custom_data: Object.keys(customData).length > 0 ? customData : undefined,
      }

      const response = await api.put(`applications/${applicationId}`, payload)

      if (response.status === 200) {
        toast.success('Profile Updated', {
          description: 'Your profile has been successfully updated.',
        })

        updateApplication(response.data)
        router.push(`/portal/${popupSlug}/attendees/${attendeeId}`)
      } else {
        throw new Error('Failed to update')
      }
    } catch (err) {
      console.error('Error saving profile:', err)
      toast.error('Error', {
        description: 'Failed to update your profile. Please try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  const renderCustomField = (field: CustomField) => {
    const fieldKey = `custom_${field.key}`
    const value = formData[fieldKey] ?? ''

    switch (field.type) {
      case 'text':
        return (
          <InputForm
            key={field.key}
            label={field.label}
            id={fieldKey}
            value={value}
            onChange={(val) => handleChange(fieldKey, val)}
            placeholder={field.placeholder}
          />
        )
      case 'textarea':
        return (
          <TextAreaForm
            key={field.key}
            label={field.label}
            id={fieldKey}
            value={value}
            handleChange={(val) => handleChange(fieldKey, val)}
            placeholder={field.placeholder}
            error=""
          />
        )
      case 'select':
        return (
          <SelectForm
            key={field.key}
            label={field.label}
            id={fieldKey}
            value={value}
            onChange={(val) => handleChange(fieldKey, val)}
            options={field.options || []}
            placeholder={field.placeholder}
          />
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
        <p className="text-muted-foreground text-lg">{error}</p>
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

  return (
    <Permissions>
      <div className="max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/portal/${popupSlug}/attendees/${attendeeId}`)}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>

        <Card className="p-8 bg-card text-card-foreground">
          <h1 className="text-2xl font-bold mb-2">Edit Your Profile</h1>
          <p className="text-muted-foreground mb-8">
            Update your directory information. Changes will be visible to other attendees.
          </p>

          {/* Basic Information */}
          <SectionWrapper
            title="Basic Information"
            subtitle="Your name and contact details"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputForm
                  label="First Name"
                  id="first_name"
                  value={formData.first_name}
                  onChange={(val) => handleChange('first_name', val)}
                  isRequired
                />
                <InputForm
                  label="Last Name"
                  id="last_name"
                  value={formData.last_name}
                  onChange={(val) => handleChange('last_name', val)}
                  isRequired
                />
              </div>

              <InputForm
                label="Telegram"
                id="telegram"
                value={formData.telegram}
                onChange={(val) => handleChange('telegram', val)}
                placeholder="@username"
              />

              <InputForm
                label="Location/Residence"
                id="residence"
                value={formData.residence}
                onChange={(val) => handleChange('residence', val)}
                placeholder="City, Country"
              />
            </div>
          </SectionWrapper>

          {/* Professional Details */}
          <SectionWrapper
            title="Professional Details"
            subtitle="Your role and organization"
          >
            <div className="space-y-6">
              <InputForm
                label="Organization"
                id="organization"
                value={formData.organization}
                onChange={(val) => handleChange('organization', val)}
              />

              <InputForm
                label="Role"
                id="role"
                value={formData.role}
                onChange={(val) => handleChange('role', val)}
              />

              <InputForm
                label="Social Media"
                id="social_media"
                value={formData.social_media}
                onChange={(val) => handleChange('social_media', val)}
                placeholder="Twitter, LinkedIn, etc."
              />

              <TextAreaForm
                label="About / Personal Goals"
                id="personal_goals"
                value={formData.personal_goals}
                handleChange={(val) => handleChange('personal_goals', val)}
                placeholder="Tell others about yourself..."
                error=""
              />
            </div>
          </SectionWrapper>

          {/* Custom Fields - Only render if this popup has custom fields */}
          {customFields.length > 0 && (
            <SectionWrapper
              title="Additional Information"
              subtitle="Event-specific details"
            >
              <div className="space-y-6">
                {customFields.map(renderCustomField)}
              </div>
            </SectionWrapper>
          )}

          {/* Save/Cancel Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => router.push(`/portal/${popupSlug}/attendees/${attendeeId}`)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </Permissions>
  )
}

export default EditProfilePage
