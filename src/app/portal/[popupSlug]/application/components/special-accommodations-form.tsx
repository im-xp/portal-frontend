"use client"

import SectionWrapper from "./SectionWrapper"
import { FormInputWrapper } from "@/components/ui/form-input-wrapper"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { SectionProps } from "@/types/Section"
import { SectionSeparator } from "./section-separator"

const MEDICAL_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const

export const SpecialAccommodationsForm = ({ formData, errors, handleChange }: SectionProps) => {
  return (
    <>
      <SectionWrapper title="Special Accommodations">
        <div className="space-y-6">
          <FormInputWrapper>
            <Label className="leading-relaxed">
              <span className="font-bold">OPTIONAL:</span> Do you have any medical
              conditions we should be aware of or would need special accommodations for?
            </Label>
            <RadioGroup
              value={formData.custom_medical_conditions ?? ""}
              onValueChange={(value) => handleChange("custom_medical_conditions", value)}
              className="flex flex-col gap-2 mt-2"
            >
              {MEDICAL_OPTIONS.map((option) => (
                <Label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                  htmlFor={`medical_${option.value}`}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`medical_${option.value}`}
                    aria-label={option.label}
                  />
                  {option.label}
                </Label>
              ))}
            </RadioGroup>
            {formData.custom_medical_conditions === "yes" && (
              <div className="mt-4">
                <Label htmlFor="accommodations_needed" className="leading-relaxed">
                  <span className="font-bold">OPTIONAL:</span> What accommodations do you need in order to participate fully?
                </Label>
                <Input
                  id="accommodations_needed"
                  value={formData.custom_accommodations_needed ?? ""}
                  onChange={(e) => handleChange("custom_accommodations_needed", e.target.value)}
                  placeholder="Describe your accommodations needs"
                  className="mt-2"
                  aria-label="What accommodations do you need in order to participate fully?"
                />
              </div>
            )}
          </FormInputWrapper>
        </div>
      </SectionWrapper>
      <SectionSeparator />
    </>
  )
}
