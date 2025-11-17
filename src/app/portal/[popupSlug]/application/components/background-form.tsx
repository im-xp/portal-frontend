import { FormInputWrapper } from "../../../../../components/ui/form-input-wrapper";
import SectionWrapper from "./SectionWrapper";
import InputForm from "@/components/ui/Form/Input";
import TextAreaForm from "@/components/ui/Form/TextArea";
import { SectionProps } from "@/types/Section";
import { motion } from "framer-motion";
import { useState } from "react";

const fieldsBackground = [
  "short_bio",
  "key_skills_expertise",
  "project_spotlight",
  "work_links"
]

export function BackgroundForm({ formData, errors, handleChange, fields }: SectionProps) {
  const [workLinkInputs, setWorkLinkInputs] = useState<string[]>(
    formData.work_links || ['', '', '']
  );

  const handleWorkLinkChange = (index: number, value: string) => {
    const newLinks = [...workLinkInputs];
    newLinks[index] = value;
    setWorkLinkInputs(newLinks);

    // Filter out empty links and update form data
    const filteredLinks = newLinks.filter(link => link.trim() !== '');
    handleChange('work_links', filteredLinks.length > 0 ? filteredLinks : []);
  };

  if (!fields || !fields.size || !fieldsBackground.some(field => fields.has(field))) return null;

  const animationProps = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  return (
    <SectionWrapper title="Background & Experience"
                    subtitle="Help us understand your background and showcase your work">
      <motion.div {...animationProps}>
        <div className="space-y-6">
          {fields.has('short_bio') && (
            <FormInputWrapper>
              <TextAreaForm
                label="Short Bio"
                id="short_bio"
                subtitle="What's your background and what are you passionate about? You can mention your field(s) of interest, notable experiences, or anything that drives your creativity."
                isRequired={true}
                error={errors.short_bio}
                placeholder="Tell us about yourself..."
                value={formData.short_bio || ''}
                handleChange={(value) => handleChange('short_bio', value)}
              />
            </FormInputWrapper>
          )}

          {fields.has('key_skills_expertise') && (
            <FormInputWrapper>
              <TextAreaForm
                label="Key Skills or Expertise"
                id="key_skills_expertise"
                subtitle="List up to 5 skills or areas of expertise you have that you'd bring to the residency. (For example: coding in Python, carpentry, video editing, event organizing, musical composition, etc.)"
                isRequired={true}
                error={errors.key_skills_expertise}
                placeholder="e.g., Python development, woodworking, graphic design, event planning..."
                value={formData.key_skills_expertise || ''}
                handleChange={(value) => handleChange('key_skills_expertise', value)}
              />
            </FormInputWrapper>
          )}

          {fields.has('project_spotlight') && (
            <FormInputWrapper>
              <TextAreaForm
                label="Project Spotlight"
                id="project_spotlight"
                subtitle="Tell us about one project or collaboration you've been involved in that you're proud of. What was it, and what did you learn from the experience?"
                isRequired={true}
                error={errors.project_spotlight}
                placeholder="Describe a project you're proud of..."
                value={formData.project_spotlight || ''}
                handleChange={(value) => handleChange('project_spotlight', value)}
              />
            </FormInputWrapper>
          )}

          {fields.has('work_links') && (
            <FormInputWrapper>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Work/Project Links
                </label>
                <p className="text-sm text-gray-600">
                  Please share a link (or up to 3 links) to examples of your work or projects. This could be a portfolio website, GitHub repo, art Instagram, video demo, etc. Anything that showcases your creativity or skills.
                </p>
                <div className="space-y-3 mt-3">
                  {[0, 1, 2].map((index) => (
                    <InputForm
                      key={index}
                      label=""
                      id={`work_link_${index}`}
                      type="url"
                      placeholder={`Link ${index + 1} (optional)`}
                      value={workLinkInputs[index] || ''}
                      onChange={(value) => handleWorkLinkChange(index, value)}
                    />
                  ))}
                  <p className="text-sm text-gray-500">
                    You can add up to 3 links. Leave empty fields blank.
                  </p>
                </div>
                {errors.work_links && (
                  <p className="text-sm text-red-600">{errors.work_links}</p>
                )}
              </div>
            </FormInputWrapper>
          )}
        </div>
      </motion.div>
    </SectionWrapper>
  )
}
