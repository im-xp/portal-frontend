import { DynamicForm } from ".."

const OptionsNotShared = [
  { value: "First name", label: "First name" },
  { value: "Last name", label: "Last name" },
  { value: "Email address", label: "Email address" },
  { value: "Telegram username", label: "Telegram username" },
  { value: "Check-in date", label: "Check-in date" },
  { value: "Check-out date", label: "Check-out date" },
  { value: "Whether or not I'm bringing kids", label: "Whether or not I'm bringing kids" },
]

export const edgeEsmeralda: DynamicForm = {
  local: 'Sonoma County',
  personal_information: {
    local_resident_title: 'Are you a Sonoma resident?'
  },
  scholarship: {
    interest_text: 'We understand that some folks will need financial assistance to attend, and have other ways to contribute beyond financial support. We have limited numbers of discounted tickets to allocate. Please elaborate on why you\'re applying, and what your contribution might be. We estimate roughly a 10 hour/week volunteer effort from folks who gets scholarships.',
  },
  fields: [
    // Personal Information
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "gender",
    "gender_specify",
    "age",
    "telegram",
    "residence",
    "eth_address",
    "referral",
    "local_resident",
    "info_not_shared",

    // Professional Details
    "organization",
    "role",
    "social_media",

    // Background & Experience
    "short_bio",
    "key_skills_expertise",
    "project_spotlight",
    "work_links",

    // Project Proposal
    "participation_type",
    "project_title",
    "project_concept_description",
    "project_sketch_media",
    "desired_collaborator_skills",
    "relevant_experience_leadership",

    // Participation Details
    "duration",
    "builder_boolean",
    "builder_description",
    "hackathon_interest",
    "investor",
    "video_url",
    "personal_goals",
    "host_session",

    // Family Information
    "brings_spouse",
    "brings_kids",
    "spouse_info",
    "spouse_email",
    "kids_info",

    // Additional Information
    "residency_motivation",
    "how_heard_about_us",
    "track_interest",
    "resources_needed",
    "alternative_participation",
    "age_verification",
    "agreement_to_values",

    // Scholarship Information
    "scholarship_interest",
    "scholarship_info",
    "scholarship_details",
    "scholarship_video_url",
    "scholarship_request",
  ]
}