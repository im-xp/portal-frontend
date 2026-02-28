import { icelandEclipsePreapproved } from "./Forms/iceland-eclipse-preapproved";
import { icelandEclipseVolunteers } from "./Forms/iceland-eclipse-volunteers";
import { rippleOnTheNile } from "./Forms/ripple-on-the-nile";

// Custom field definition for popup-specific questions stored in JSONB
export type CustomField = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'boolean' | 'select' | 'image';
  placeholder?: string;
  section?: 'personal_information' | 'professional_details' | 'participation' | 'other';
  required?: boolean;
  options?: { value: string; label: string }[];
  showWhen?: { field: string; value: any };
}

export type DynamicForm = {
  local?: string,
  [key: string]: any,
  personal_information?:{
    title?: string,
    subtitle?: string,
    residence_placeholder?: string,
    local_resident_title?: string,
    [key: string]: any,
  },
  professional_details?:{
    title?: string,
    subtitle?: string,
    [key: string]: any,
  },
  participation?:{
    title?: string,
    subtitle?: string,
    duration_label?: string,
    duration_subtitle?: string,
    [key: string]: any,
  },
  scholarship?: {
    title?: string,
    subtitle?: string,
    interest_text?: string,
    scholarship_request?: string,
    [key: string]: any,
  },
  accommodation?: {
    title?: string,
    subtitle?: string,
    [key: string]: any,
  },
  fields: string[],
  customFields?: CustomField[],
  attendeesDirectory?: boolean,
  directoryFilters?: {
    weeks?: boolean,
    bringsKids?: boolean,
  },
}

export const dynamicForm: Record<string, DynamicForm | null> = {
  'default': icelandEclipsePreapproved,
  'iceland-eclipse': icelandEclipsePreapproved,
  'iceland-eclipse-volunteers': icelandEclipseVolunteers,
  'ripple-on-the-nile': rippleOnTheNile,
}