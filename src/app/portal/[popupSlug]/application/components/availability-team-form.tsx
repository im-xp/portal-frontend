"use client"

import { motion, AnimatePresence } from "framer-motion"
import SectionWrapper from "./SectionWrapper"
import InputForm from "@/components/ui/Form/Input"
import TextAreaForm from "@/components/ui/Form/TextArea"
import MultiSelectDropdown from "@/components/ui/Form/MultiselectDropdown"
import { FormInputWrapper } from "@/components/ui/form-input-wrapper"
import { LabelRequired } from "@/components/ui/label"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SectionProps } from "@/types/Section"
import { SectionSeparator } from "./section-separator"
import {
  PRODUCTION_PHASES_OPTIONS,
  TEAM_OPTIONS,
} from "../constants/availability"

const REFERRAL_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const

const animationProps = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.3, ease: "easeInOut" },
}

const BUILD_TEAM_VALUES = ["build", "art_decor"]

export const AvailabilityTeamForm = ({ formData, errors, handleChange }: SectionProps) => {
  const isReferred = formData.custom_staff_referral === "yes"
  const selectedTeams = (formData.custom_team_preferences as string[]) ?? []
  const showBuildExperience = selectedTeams.some((t) => BUILD_TEAM_VALUES.includes(t))

  return (
    <>
      <SectionWrapper title="Availability & Team Preference">
        <div className="space-y-6">
          <FormInputWrapper>
            <LabelRequired isRequired>
              Keeping in mind the Arrival Day and Work Requirement, which phase(s)
              of the production are you <em>available</em> to help during?{" "}
              <span className="underline">
                You must be able to arrive on the set Arrival Day
              </span>
            </LabelRequired>
            <MultiSelectDropdown
              options={PRODUCTION_PHASES_OPTIONS}
              onChange={(values) => handleChange("custom_available_phases", values)}
              defaultValue={(formData.custom_available_phases as string[]) ?? []}
              error={errors.custom_available_phases}
              placeholder="+ Add"
            />
          </FormInputWrapper>

          <FormInputWrapper>
            <LabelRequired isRequired>
              Are you being referred to a team by a staff member?
            </LabelRequired>
            <RadioGroup
              value={formData.custom_staff_referral ?? ""}
              onValueChange={(value) => handleChange("custom_staff_referral", value)}
              className="flex flex-col gap-2 mt-2"
            >
              {REFERRAL_OPTIONS.map((option) => (
                <Label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                  htmlFor={`referral_${option.value}`}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`referral_${option.value}`}
                    aria-label={option.label}
                  />
                  {option.label}
                </Label>
              ))}
            </RadioGroup>
            {errors.custom_staff_referral && (
              <p className="text-destructive text-sm mt-1">
                {errors.custom_staff_referral}
              </p>
            )}
          </FormInputWrapper>

          <AnimatePresence>
            {isReferred && (
              <motion.div {...animationProps}>
                <InputForm
                  label="Who is referring you?"
                  id="custom_referral_name"
                  value={formData.custom_referral_name ?? ""}
                  onChange={(value) => handleChange("custom_referral_name", value)}
                  error={errors.custom_referral_name}
                  isRequired
                />
              </motion.div>
            )}
          </AnimatePresence>

          <FormInputWrapper>
            <LabelRequired isRequired>
              Which teams are you interested in volunteering with?{" "}
              <span className="underline">Select at least 2</span>
            </LabelRequired>
            <MultiSelectDropdown
              options={TEAM_OPTIONS}
              onChange={(values) => handleChange("custom_team_preferences", values)}
              defaultValue={(formData.custom_team_preferences as string[]) ?? []}
              error={errors.custom_team_preferences}
              placeholder="+ Add"
            />
          </FormInputWrapper>

          <AnimatePresence>
            {showBuildExperience && (
              <motion.div {...animationProps}>
                <TextAreaForm
                  label="Tell us about any relevant past build experience or projects you've worked on, and what role you played in them."
                  id="custom_build_experience"
                  value={formData.custom_build_experience ?? ""}
                  handleChange={(value) => handleChange("custom_build_experience", value)}
                  error={errors.custom_build_experience}
                  isRequired
                />
              </motion.div>
            )}
          </AnimatePresence>

          <TextAreaForm
            label="Why would you be a strong contributor to the teams you selected?"
            id="custom_team_contribution"
            value={formData.custom_team_contribution ?? ""}
            handleChange={(value) => handleChange("custom_team_contribution", value)}
            error={errors.custom_team_contribution}
            isRequired
            subtitle="We really like it when you reference specific experience you have! Please limit responses to 2-3 sentences per team."
          />
        </div>
      </SectionWrapper>
      <SectionSeparator />
    </>
  )
}
