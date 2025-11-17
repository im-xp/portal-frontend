import { FormInputWrapper } from "../../../../../components/ui/form-input-wrapper";
import SectionWrapper from "./SectionWrapper";
import InputForm from "@/components/ui/Form/Input";
import TextAreaForm from "@/components/ui/Form/TextArea";
import CheckboxForm from "@/components/ui/Form/Checkbox";
import { SectionProps } from "@/types/Section";
import { motion } from "framer-motion";

const fieldsAdditional = [
  "residency_motivation",
  "how_heard_about_us",
  "age_verification",
  "agreement_to_values",
  "alternative_participation",
  "resources_needed",
  "track_interest"
]

export function AdditionalInfoForm({ formData, errors, handleChange, fields }: SectionProps) {
  if (!fields || !fields.size || !fieldsAdditional.some(field => fields.has(field))) return null;

  const animationProps = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  return (
    <SectionWrapper title="Additional Information"
                    subtitle="Final questions to help us understand your application">
      <motion.div {...animationProps}>
        <div className="space-y-6">
          {fields.has('residency_motivation') && (
            <FormInputWrapper>
              <TextAreaForm
                label="Why Iceland Eclipse Builders?"
                id="residency_motivation"
                subtitle="In your own words, why do you want to be part of the Iceland Eclipse Builders Residency? What do you hope to contribute to the community and gain from the experience?"
                isRequired={true}
                error={errors.residency_motivation}
                placeholder="Share your motivation for joining the residency..."
                value={formData.residency_motivation || ''}
                handleChange={(value) => handleChange('residency_motivation', value)}
              />
            </FormInputWrapper>
          )}

          {fields.has('how_heard_about_us') && (
            <FormInputWrapper>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  How Did You Hear About Us?
                </label>
                <select
                  value={formData.how_heard_about_us || ''}
                  onChange={(e) => handleChange('how_heard_about_us', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select how you heard about us</option>
                  <option value="social_media">Social Media</option>
                  <option value="friend_colleague">Friend/Colleague</option>
                  <option value="search_engine">Search Engine</option>
                  <option value="news_article">News Article</option>
                  <option value="event_conference">Event/Conference</option>
                  <option value="previous_participant">Previous Participant</option>
                  <option value="other">Other</option>
                </select>
                {errors.how_heard_about_us && (
                  <p className="text-sm text-red-600">{errors.how_heard_about_us}</p>
                )}
              </div>
            </FormInputWrapper>
          )}

          {fields.has('track_interest') && (
            <FormInputWrapper>
              <InputForm
                label="Track Interest"
                id="track_interest"
                subtitle="Are you interested in a specific track or theme?"
                error={errors.track_interest}
                type="text"
                placeholder="e.g., Technology, Arts, Sustainability, Community Building..."
                value={formData.track_interest || ''}
                onChange={(value) => handleChange('track_interest', value)}
              />
            </FormInputWrapper>
          )}

          {fields.has('resources_needed') && (
            <FormInputWrapper>
              <TextAreaForm
                label="Resources Needed"
                id="resources_needed"
                subtitle="What resources or support would you need to successfully participate?"
                error={errors.resources_needed}
                placeholder="List any resources you might need..."
                value={formData.resources_needed || ''}
                handleChange={(value) => handleChange('resources_needed', value)}
              />
            </FormInputWrapper>
          )}

          {fields.has('alternative_participation') && (
            <FormInputWrapper>
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <CheckboxForm
                    id="alternative_participation"
                    checked={formData.alternative_participation || false}
                    onCheckedChange={(checked) => handleChange('alternative_participation', checked)}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Alternative Participation
                    </label>
                    <p className="text-sm text-gray-600">
                      If for some reason your project cannot be selected, would you be interested in joining the residency as a participant in another capacity?
                    </p>
                  </div>
                </div>
                {errors.alternative_participation && (
                  <p className="text-sm text-red-600">{errors.alternative_participation}</p>
                )}
              </div>
            </FormInputWrapper>
          )}

          {fields.has('age_verification') && (
            <FormInputWrapper>
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <CheckboxForm
                    id="age_verification"
                    checked={formData.age_verification || false}
                    onCheckedChange={(checked) => handleChange('age_verification', checked)}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Age Verification <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-600">
                      Participants must be 18 or older by July 2026.
                    </p>
                    <p className="text-sm text-gray-700">
                      I confirm I will be 18 years or older by July 2026
                    </p>
                  </div>
                </div>
                {errors.age_verification && (
                  <p className="text-sm text-red-600">{errors.age_verification}</p>
                )}
              </div>
            </FormInputWrapper>
          )}

          {fields.has('agreement_to_values') && (
            <FormInputWrapper>
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <CheckboxForm
                    id="agreement_to_values"
                    checked={formData.agreement_to_values || false}
                    onCheckedChange={(checked) => handleChange('agreement_to_values', checked)}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Agreement to Residency Values <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-600">
                      Do you agree to uphold the residency's values of collaboration, openness, sustainability, and respect for all participants, local culture, and the environment?
                    </p>
                    <p className="text-sm text-gray-700">
                      I agree to uphold the residency's values of collaboration, openness, sustainability, and respect for all participants, local culture, and the environment
                    </p>
                  </div>
                </div>
                {errors.agreement_to_values && (
                  <p className="text-sm text-red-600">{errors.agreement_to_values}</p>
                )}
              </div>
            </FormInputWrapper>
          )}
        </div>
      </motion.div>
    </SectionWrapper>
  )
}
