import { DynamicForm } from ".."

export const rippleOnTheNile: DynamicForm = {
  local: 'Egypt',
  personal_information: {
    title: 'Onboarding Information',
    subtitle: 'Welcome to Ripple on the Nile! Please share your information to join this co-creation journey.',
    residence_placeholder: 'Your home country',
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
    // Personal Information (existing fields)
    "first_name",
    "last_name",
    "email",
    "telegram",
    "social_media",  // Website/Social Media
    "residence",     // Home Country
    
    // Professional Details (existing fields)
    "organization",
    "role",
    "area_of_expertise",
  ],
  
  // Custom fields that will be stored in custom_data JSONB
  // These are Ripple-specific questions
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
      label: "Short Bio",
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
      label: "Anything else you would like to share?",
      type: "textarea",
      placeholder: "Questions, comments, or concerns",
      section: "participation",
      required: false,
    },
    // Additional Questions Section
    {
      key: "cocreation_experience",
      label: "Have you ever been part of a co-creation container?",
      type: "boolean",
      section: "other",
      required: true,
    },
    {
      key: "cocreation_details",
      label: "Tell us about your co-creation experience!",
      type: "textarea",
      placeholder: "Describe your previous co-creation experiences",
      section: "other",
      required: false,
      showWhen: { field: "cocreation_experience", value: true },
    },
    {
      key: "ripple_contribution",
      label: "What do you plan on contributing to the Ripple?",
      type: "textarea",
      section: "other",
      required: false,
    },
    {
      key: "current_questions",
      label: "What questions are you currently asking?",
      type: "textarea",
      placeholder: "The questions on your mind",
      section: "other",
      required: false,
    },
    {
      key: "most_alive_cocreating",
      label: "When do you feel most alive when co-creating with others?",
      type: "textarea",
      section: "other",
      required: false,
    },
    {
      key: "success_vision",
      label: "What would a successful Ripple on the Nile look like to you?",
      type: "textarea",
      section: "other",
      required: false,
    },
    {
      key: "been_to_egypt",
      label: "Have you ever been to Egypt before?",
      type: "boolean",
      section: "other",
      required: true,
    },
    {
      key: "questions_concerns",
      label: "What questions or concerns do you have?",
      type: "textarea",
      section: "other",
      required: false,
    },
    {
      key: "team_needs_to_know",
      label: "Is there anything the IMXP team needs to know?",
      type: "textarea",
      placeholder: "Special requirements, accessibility needs, etc.",
      section: "other",
      required: false,
    },
  ],
}

