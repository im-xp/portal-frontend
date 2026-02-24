"use client"

import { useState } from "react"
import { Check, ChevronDown, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"


interface Option {
  value: string
  label: string
  description?: string
}

interface MultiSelectDropdownProps {
  options: Option[]
  onChange: (selectedValues: string[]) => void
  defaultValue?: string[]
  title?: string
  maxSelections?: number
  error?: string
  placeholder?: string
}


export default function MultiSelectDropdown({ options, onChange, defaultValue, title, maxSelections, error, placeholder }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue ?? [])

  const isAtLimit = maxSelections !== undefined && selectedValues.length >= maxSelections

  const handleSelect = (value: string) => {
    const isSelected = selectedValues.includes(value)
    if (!isSelected && isAtLimit) return

    const newSelectedValues = isSelected
      ? selectedValues.filter((item) => item !== value) 
      : [...selectedValues, value]
    
    setSelectedValues(newSelectedValues)
    onChange(newSelectedValues)
  }

  const handleRemove = (value: string) => {
    const newSelectedValues = selectedValues.filter((item) => item !== value)
    setSelectedValues(newSelectedValues)
    onChange(newSelectedValues)
  }

  const selectedOptions = options.filter((option) => selectedValues.includes(option.value))
  const hasDescriptions = options.some((option) => option.description)

  return (
    <div className="w-full">
        <label className="text-sm font-medium">{title}</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-full justify-between min-h-10 h-auto bg-background ${error ? 'border-red-500' : ''}`}
            >
              <div className="flex flex-wrap gap-1 flex-1">
                {selectedValues.length === 0 ? (
                  <span className="text-muted-foreground">{placeholder ?? "Select options..."}</span>
                ) : (
                  selectedOptions.map((option) => (
                    <Badge key={option.value} variant="secondary" className="mr-1 mb-1">
                      {option.label}
                      <span
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            handleRemove(option.value)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemove(option.value)
                        }}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </span>
                    </Badge>
                  ))
                )}
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <div className="flex items-center border-b px-1">
                <CommandInput placeholder="Search for option..." className="flex-1" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-sm hover:bg-accent"
                  aria-label="Close dropdown"
                  tabIndex={0}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <CommandList>
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                      className={`cursor-pointer ${hasDescriptions ? 'py-3 border-b last:border-b-0' : ''} ${!selectedValues.includes(option.value) && isAtLimit ? 'opacity-40 cursor-not-allowed' : ''}`}
                      disabled={!selectedValues.includes(option.value) && isAtLimit}
                    >
                      {option.description ? (
                        <div className="flex items-start space-x-2 w-full">
                          <Checkbox
                            checked={selectedValues.includes(option.value)}
                            onChange={() => handleSelect(option.value)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-sm">{option.label}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              <span className="font-semibold">Team Description: </span>
                              {option.description}
                            </p>
                          </div>
                          {selectedValues.includes(option.value) && <Check className="h-4 w-4 mt-1 shrink-0" />}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 w-full">
                          <Checkbox
                            checked={selectedValues.includes(option.value)}
                            onChange={() => handleSelect(option.value)}
                          />
                          <span className="flex-1">{option.label}</span>
                          {selectedValues.includes(option.value) && <Check className="h-4 w-4" />}
                        </div>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {maxSelections && (
          <p className="text-xs text-muted-foreground mt-1">
            {selectedValues.length}/{maxSelections} selected
          </p>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
