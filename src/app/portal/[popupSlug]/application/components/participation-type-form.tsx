import { FormInputWrapper } from "../../../../../components/ui/form-input-wrapper";
import SectionWrapper from "./SectionWrapper";
import { SectionProps } from "@/types/Section";
import { motion } from "framer-motion";
import InputForm from "@/components/ui/Form/Input";
import TextAreaForm from "@/components/ui/Form/TextArea";

const fieldsParticipationType = [
  "participation_type",
  "project_title",
  "project_concept_description",
  "project_sketch_media",
  "desired_collaborator_skills",
  "relevant_experience_leadership"
]

export function ParticipationTypeForm({ formData, errors, handleChange, fields }: SectionProps) {
  if (!fields || !fields.size || !fieldsParticipationType.some(field => fields.has(field))) return null;

  return (
    <SectionWrapper title="Your Participation"
                    subtitle="Tell us about how you'd like to participate in the residency">
      <div className="space-y-6">
        {fields.has('participation_type') && (
          <FormInputWrapper>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                How would you like to participate? <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.participation_type || ''}
                onChange={(e) => handleChange('participation_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select participation type</option>
                <option value="lead_project">Lead my own project</option>
                <option value="join_project">Join someone else's project</option>
                <option value="participant">Participate as a general contributor</option>
                <option value="observer">Observe and learn</option>
                <option value="other">Other</option>
              </select>
              {errors.participation_type && (
                <p className="text-sm text-red-600">{errors.participation_type}</p>
              )}
            </div>
          </FormInputWrapper>
        )}

        {formData.participation_type === 'lead_project' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="space-y-6">
              {fields.has('project_title') && (
                <FormInputWrapper>
                  <InputForm
                    label="Project Title"
                    id="project_title"
                    subtitle="A tentative name or short title for your project or experience"
                    isRequired={true}
                    error={errors.project_title}
                    type="text"
                    placeholder="e.g., 'Aurora Code Symphony' or 'Interactive Light Installation'"
                    value={formData.project_title || ''}
                    onChange={(value) => handleChange('project_title', value)}
                  />
                </FormInputWrapper>
              )}

              {fields.has('project_concept_description') && (
                <FormInputWrapper>
                  <TextAreaForm
                    label="Project Concept Description"
                    id="project_concept_description"
                    subtitle="What do you propose to create or lead during the residency? For example, is it an interactive installation, a series of workshops, a performance, a research experiment, or something else?"
                    isRequired={true}
                    error={errors.project_concept_description}
                    placeholder="Describe your project concept in detail..."
                    value={formData.project_concept_description || ''}
                    handleChange={(value) => handleChange('project_concept_description', value)}
                  />
                </FormInputWrapper>
              )}

              {fields.has('project_sketch_media') && (
                <FormInputWrapper>
                  <InputForm
                    label="Project Sketch / Media"
                    id="project_sketch_media"
                    subtitle="Include a link to supporting material for your proposal, such as sketches, diagrams, mood boards, or a one-page concept document."
                    error={errors.project_sketch_media}
                    type="url"
                    placeholder="https://..."
                    value={formData.project_sketch_media || ''}
                    onChange={(value) => handleChange('project_sketch_media', value)}
                  />
                </FormInputWrapper>
              )}

              {fields.has('desired_collaborator_skills') && (
                <FormInputWrapper>
                  <TextAreaForm
                    label="Desired Collaborator Skills"
                    id="desired_collaborator_skills"
                    subtitle="What types of skills or disciplines would ideally complement your project? (E.g. 'Looking for a game developer and a sound designer' or 'Any enthusiastic makers welcome, especially with electronics.')"
                    error={errors.desired_collaborator_skills}
                    placeholder="Describe the skills you're looking for..."
                    value={formData.desired_collaborator_skills || ''}
                    handleChange={(value) => handleChange('desired_collaborator_skills', value)}
                  />
                </FormInputWrapper>
              )}

              {fields.has('relevant_experience_leadership') && (
                <FormInputWrapper>
                  <TextAreaForm
                    label="Relevant Experience & Leadership"
                    id="relevant_experience_leadership"
                    subtitle="Briefly tell us about your experience leading projects or workshops. Why are you the right person to bring this project to life?"
                    error={errors.relevant_experience_leadership}
                    placeholder="Share your relevant experience..."
                    value={formData.relevant_experience_leadership || ''}
                    handleChange={(value) => handleChange('relevant_experience_leadership', value)}
                  />
                </FormInputWrapper>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  )
}

