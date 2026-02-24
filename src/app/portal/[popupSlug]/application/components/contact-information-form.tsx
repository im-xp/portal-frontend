"use client"

import SectionWrapper from "./SectionWrapper"
import InputForm from "@/components/ui/Form/Input"
import PhoneInputForm from "@/components/ui/Form/PhoneInput"
import { FormInputWrapper } from "@/components/ui/form-input-wrapper"
import { Label, LabelRequired } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SectionProps } from "@/types/Section"
import { SectionSeparator } from "./section-separator"
import { cn } from "@/lib/utils"

const NEWSLETTER_OPTIONS = [
  { value: "yes", label: "Yes, sign me up!" },
  { value: "no", label: "No, I'm good." },
] as const

export const ContactInformationForm = ({ formData, errors, handleChange }: SectionProps) => {
  return (
    <>
      <SectionWrapper title="Contact Information">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputForm
              label="Email Address"
              id="email"
              value={formData.email ?? ""}
              onChange={(value) => handleChange("email", value)}
              error={errors.email}
              isRequired
              subtitle="You must use a different email address for each application submitted. Please double check spelling!"
              placeholder="sample@gmail.com"
              type="email"
            />

            <PhoneInputForm
              label="Phone Number"
              id="custom_phone_number"
              value={formData.custom_phone_number ?? ""}
              onChange={(value) => handleChange("custom_phone_number", value)}
              error={errors.custom_phone_number}
              isRequired
              subtitle="By providing your phone number, you agree to receive text messages related to your volunteer application and scheduled shifts. Standard messaging rates may apply. You may opt out at any time by replying STOP."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputForm
              label="Emergency Contact Name"
              id="custom_emergency_contact_name"
              value={formData.custom_emergency_contact_name ?? ""}
              onChange={(value) => handleChange("custom_emergency_contact_name", value)}
              error={errors.custom_emergency_contact_name}
              isRequired
            />

            <PhoneInputForm
              label="Emergency Contact Phone #"
              id="custom_emergency_contact_phone"
              value={formData.custom_emergency_contact_phone ?? ""}
              onChange={(value) => handleChange("custom_emergency_contact_phone", value)}
              error={errors.custom_emergency_contact_phone}
              isRequired
            />
          </div>

          <FormInputWrapper>
            <LabelRequired isRequired>
              Want to stay in the loop about future Eclipse events and Shift Happens opportunities?
            </LabelRequired>
            <p className="text-sm text-muted-foreground italic">
              You can opt-out anytime
            </p>
            <RadioGroup
              value={formData.custom_newsletter_opt_in ?? ""}
              onValueChange={(value) => handleChange("custom_newsletter_opt_in", value)}
              className={cn(
                "flex flex-col gap-2 mt-2",
                errors.custom_newsletter_opt_in && "border rounded-md border-red-500 p-2"
              )}
            >
              {NEWSLETTER_OPTIONS.map((option) => (
                <Label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                  htmlFor={`newsletter_${option.value}`}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`newsletter_${option.value}`}
                    aria-label={option.label}
                  />
                  {option.label}
                </Label>
              ))}
            </RadioGroup>
            {errors.custom_newsletter_opt_in && (
              <p className="text-red-500 text-sm">{errors.custom_newsletter_opt_in}</p>
            )}
          </FormInputWrapper>
        </div>
      </SectionWrapper>
      <SectionSeparator />
    </>
  )
}
