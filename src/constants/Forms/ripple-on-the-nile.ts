import { DynamicForm } from ".."

export const rippleOnTheNile: DynamicForm = {
  local: 'Egypt',
  personal_information: {
    title: 'Onboarding Information',
    subtitle: 'Welcome to Ripple on the Nile! Please share your information to join this co-creation journey.',
  },
  professional_details: {
    title: 'About You',
    subtitle: 'Tell us about your work and expertise',
  },
  participation: {
    title: 'Your Vision for Ripple',
    subtitle: 'Help us understand what you hope to contribute and experience',
  },
  // Standard fields that map to existing Application columns
  fields: [
    // Personal Information
    "first_name",
    "last_name",
    "email",
    "telegram",
    "social_media",  // Website/Social Media
    
    // Professional Details
    "organization",
    "role",
  ],
  
  // Custom fields stored in custom_data JSONB
  customFields: [
    {
      key: "headshot_url",
      label: "Personal Photo/Headshot",
      type: "text",
      placeholder: "Please share a hi-res link to your image (Google Drive, Dropbox, etc.)",
      section: "personal_information",
      required: true,
    },
    {
      key: "short_bio",
      label: "Short Bio w/ Areas of Expertise + Home Country",
      type: "textarea",
      placeholder: "Include your areas of expertise and home country",
      section: "personal_information",
      required: true,
    },
    {
      key: "expectations",
      label: "What are your expectations for 'Ripple on the Nile' as a container for co-creation on Egypt Eclipse 2027?",
      type: "textarea",
      placeholder: "Share your vision and hopes for this journey",
      section: "participation",
      required: true,
    },
    {
      key: "gifts_to_contribute",
      label: "What gifts do you plan to contribute to the journey?",
      type: "textarea",
      placeholder: "Your skills, experiences, or offerings",
      section: "participation",
      required: true,
    },
    {
      key: "egypt_experience",
      label: "What experience do you have in Egypt and what would you like to discover there?",
      type: "textarea",
      placeholder: "Previous visits, interests, curiosities",
      section: "participation",
      required: true,
    },
    {
      key: "anything_else",
      label: "Anything else you would like to share? Questions, comments or concerns?",
      type: "textarea",
      placeholder: "Questions, comments, or concerns",
      section: "participation",
      required: false,
    },
  ],
}
