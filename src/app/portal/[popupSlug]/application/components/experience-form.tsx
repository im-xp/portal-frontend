"use client"

import SectionWrapper from "./SectionWrapper"
import SelectForm from "@/components/ui/Form/Select"
import TextAreaForm from "@/components/ui/Form/TextArea"
import MultiSelectDropdown from "@/components/ui/Form/MultiselectDropdown"
import { FormInputWrapper } from "@/components/ui/form-input-wrapper"
import { LabelRequired, LabelMuted } from "@/components/ui/label"
import { SectionProps } from "@/types/Section"
import { SectionSeparator } from "./section-separator"
import {
  ECLIPSE_ATTENDANCE_OPTIONS,
  VOLUNTEER_TYPE_OPTIONS,
  TALENTS_SKILLS_OPTIONS,
} from "../constants/experience"

export const ExperienceForm = ({ formData, errors, handleChange }: SectionProps) => {
  return (
    <>
      <SectionWrapper title="Experience">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectForm
              label="Have you attended or volunteered at an Eclipse event or with Shift Happens before?"
              id="custom_eclipse_attendance"
              value={formData.custom_eclipse_attendance ?? ""}
              onChange={(value) => handleChange("custom_eclipse_attendance", value)}
              error={errors.custom_eclipse_attendance}
              isRequired
              placeholder="Select..."
              options={ECLIPSE_ATTENDANCE_OPTIONS}
            />

            <SelectForm
              label="Which of these would you consider yourself?"
              id="custom_volunteer_type"
              value={formData.custom_volunteer_type ?? ""}
              onChange={(value) => handleChange("custom_volunteer_type", value)}
              error={errors.custom_volunteer_type}
              isRequired
              placeholder="Select..."
              options={VOLUNTEER_TYPE_OPTIONS}
            />
          </div>

          <TextAreaForm
            label="Please describe your previous festival experience. If you've volunteered/worked a festival, let us know which ones and what roles. If this is your first time, let us know that too!"
            id="custom_festival_experience"
            value={formData.custom_festival_experience ?? ""}
            handleChange={(value) => handleChange("custom_festival_experience", value)}
            error={errors.custom_festival_experience}
            isRequired
          />

          <FormInputWrapper>
            <LabelRequired isRequired>
              What are your talents and skills?{" "}
              <span className="underline">Select up to FIVE</span>
            </LabelRequired>
            <MultiSelectDropdown
              options={TALENTS_SKILLS_OPTIONS}
              onChange={(values) => handleChange("custom_talents_skills", values)}
              defaultValue={(formData.custom_talents_skills as string[]) ?? []}
              maxSelections={5}
              error={errors.custom_talents_skills}
              placeholder="Select up to 5 skills..."
            />
          </FormInputWrapper>

          <TextAreaForm
            label="Please describe relevant experience for each skill in 1-2 sentences each"
            id="custom_skills_description"
            value={formData.custom_skills_description ?? ""}
            handleChange={(value) => handleChange("custom_skills_description", value)}
            error={errors.custom_skills_description}
            isRequired
          />
        </div>
      </SectionWrapper>
      <SectionSeparator />
    </>
  )
}
