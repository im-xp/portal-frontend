import { DynamicForm } from ".."

export const icelandEclipsePreapproved: DynamicForm = {
  personal_information: {
    title: 'Registration Information',
    subtitle: 'Welcome! Please provide your information to complete your registration and purchase your ticket.'
  },
  fields: [
    "first_name",
    "last_name",
    "email",
    "telegram"
  ],
  attendeesDirectory: true,
  customFields: [
    {
      key: "headshot_url",
      label: "Profile Photo",
      type: "image",
      placeholder: "Upload a photo of yourself",
      section: "personal_information",
      required: false,
    },
    {
      key: "short_bio",
      label: "Short Bio",
      type: "textarea",
      placeholder: "Tell others a bit about yourself, your work, and what brings you here",
      section: "personal_information",
      required: false,
    },
  ],
}
