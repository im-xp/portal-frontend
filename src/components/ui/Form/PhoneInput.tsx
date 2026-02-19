"use client"

import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { FormInputWrapper } from "../form-input-wrapper"
import { LabelMuted, LabelRequired } from "../label"
import { cn } from "@/lib/utils"

interface PhoneInputFormProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  error?: string
  isRequired?: boolean
  subtitle?: string
  placeholder?: string
}

const PhoneInputForm = ({
  label,
  id,
  value,
  onChange,
  error,
  isRequired = false,
  subtitle,
  placeholder,
}: PhoneInputFormProps) => {
  const handleValueChange = (val: string | undefined) => {
    onChange(val ?? "")
  }

  return (
    <FormInputWrapper>
      <div className="flex flex-col gap-2">
        <LabelRequired htmlFor={id} isRequired={isRequired} className="flex">
          {label}
        </LabelRequired>
        {subtitle && (
          <LabelMuted className="text-sm text-muted-foreground">
            {subtitle}
          </LabelMuted>
        )}
      </div>
      <PhoneInput
        id={id}
        international
        defaultCountry="US"
        value={value}
        onChange={handleValueChange}
        placeholder={placeholder}
        className={cn(
          "phone-input-field flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring md:text-sm",
          error && "border-red-400 focus-within:ring-red-400/30"
        )}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </FormInputWrapper>
  )
}

export default PhoneInputForm
