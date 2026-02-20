"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import SectionWrapper from "./SectionWrapper"
import InputForm from "@/components/ui/Form/Input"
import { Checkbox } from "@/components/ui/checkbox"
import { FormInputWrapper } from "@/components/ui/form-input-wrapper"
import { LabelRequired } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { SectionProps } from "@/types/Section"
import { SectionSeparator } from "./section-separator"
import { COUNTRIES } from "../constants/countries"

const TICKET_OPTIONS = [
  { value: "no", label: "No" },
  { value: "ga", label: "Yes, I have an Eclipse Seeker (GA) ticket" },
  { value: "vip", label: "Yes, I have a Celestial Voyager (VIP) ticket" },
] as const

export const AboutYouForm = ({ formData, errors, handleChange }: SectionProps) => {
  const [countryOpen, setCountryOpen] = useState(false)

  const handleTicketChange = (value: string) => {
    const currentValue = formData.custom_ticket_type
    handleChange("custom_ticket_type", currentValue === value ? "" : value)
  }

  const handleClearCountry = () => {
    handleChange("residence", "")
  }

  return (
    <>
      <SectionWrapper title="About You">
        <div className="space-y-6">
          {/* Data Privacy & Consent Agreement */}
          <FormInputWrapper>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="custom_data_privacy_consent"
                checked={!!formData.custom_data_privacy_consent}
                onCheckedChange={(checked: boolean) =>
                  handleChange("custom_data_privacy_consent", checked)
                }
                aria-label="Data Privacy and Consent Agreement"
                className="mt-0.5"
              />
              <label
                htmlFor="custom_data_privacy_consent"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I have read and understood the{" "}
                <a
                  href="#"
                  className="text-primary underline hover:text-primary/80"
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={0}
                  aria-label="Open Data Privacy and Consent Agreement"
                >
                  Data Privacy &amp; Consent Agreement
                </a>{" "}
                and consent to the collection, use, and processing of my personal
                information for purposes related to my application and participation
                in the program. I understand I may withdraw my consent at any time.{" "}
                <span className="text-destructive">*</span>
              </label>
            </div>
            {errors.custom_data_privacy_consent && (
              <p className="text-destructive text-sm flex items-center gap-1 mt-1">
                <span aria-hidden="true">⊘</span>
                We need your consent to process your application. Please review and
                accept the Data Privacy &amp; Consent Agreement to proceed.
              </p>
            )}
          </FormInputWrapper>

          {/* Full Name + Chosen Name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InputForm
              label="Full Name"
              id="custom_full_name"
              value={formData.custom_full_name ?? ""}
              onChange={(value) => handleChange("custom_full_name", value)}
              error={errors.custom_full_name}
              isRequired
              subtitle="This should be the name on your ID"
            />

            <FormInputWrapper>
              <div className="flex items-center space-x-2 sm:mt-8">
                <Checkbox
                  id="custom_has_chosen_name"
                  checked={!!formData.custom_has_chosen_name}
                  onCheckedChange={(checked: boolean) => {
                    handleChange("custom_has_chosen_name", checked)
                    if (!checked) handleChange("custom_chosen_name", "")
                  }}
                  aria-label="I have a chosen name that is different than my legal name"
                />
                <label
                  htmlFor="custom_has_chosen_name"
                  className="text-sm text-muted-foreground cursor-pointer leading-snug"
                >
                  I have a chosen name that&apos;s different than my legal name
                </label>
              </div>

              {!!formData.custom_has_chosen_name && (
                <InputForm
                  label="Chosen Name / Nickname"
                  id="custom_chosen_name"
                  value={formData.custom_chosen_name ?? ""}
                  onChange={(value) => handleChange("custom_chosen_name", value)}
                  error={errors.custom_chosen_name}
                  isRequired
                  placeholder="Enter your chosen name or nickname"
                />
              )}
            </FormInputWrapper>
          </div>

          {/* Ticket Purchase */}
          <FormInputWrapper>
            <LabelRequired isRequired>
              Have you already purchased a ticket to Iceland Eclipse?
            </LabelRequired>
            <div className="space-y-2 mt-2">
              {TICKET_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  htmlFor={`ticket_${option.value}`}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <Checkbox
                    id={`ticket_${option.value}`}
                    checked={formData.custom_ticket_type === option.value}
                    onCheckedChange={() => handleTicketChange(option.value)}
                    aria-label={option.label}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.custom_ticket_type && (
              <p className="text-destructive text-sm mt-1">
                {errors.custom_ticket_type}
              </p>
            )}
          </FormInputWrapper>

          {/* Country of Residence (Combobox) */}
          <FormInputWrapper>
            <LabelRequired htmlFor="residence" isRequired>
              Country of Residence
            </LabelRequired>
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <div className="relative">
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countryOpen}
                    aria-label="Select country of residence"
                    className={cn(
                      "w-full justify-between font-normal bg-white h-10",
                      !formData.residence && "text-muted-foreground",
                      errors.residence && "border-destructive"
                    )}
                  >
                    {formData.residence
                      ? COUNTRIES.find((c) => c.value === formData.residence)?.label ?? formData.residence
                      : "Select a country..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                {formData.residence && (
                  <button
                    type="button"
                    onClick={handleClearCountry}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-accent"
                    aria-label="Clear country selection"
                    tabIndex={0}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {COUNTRIES.map((country) => (
                        <CommandItem
                          key={country.value}
                          value={country.value}
                          onSelect={(currentValue) => {
                            handleChange("residence", currentValue === formData.residence ? "" : currentValue)
                            setCountryOpen(false)
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.residence === country.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {country.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.residence && (
              <p className="text-destructive text-sm mt-1">{errors.residence}</p>
            )}
          </FormInputWrapper>

          {/* City or Town */}
          <InputForm
            label="What city or town do you live in?"
            id="custom_city_town"
            value={formData.custom_city_town ?? ""}
            onChange={(value) => handleChange("custom_city_town", value)}
            error={errors.custom_city_town}
            isRequired
          />
        </div>
      </SectionWrapper>
      <SectionSeparator />
    </>
  )
}
