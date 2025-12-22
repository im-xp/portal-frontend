import { edgeEsmeralda } from "./Forms/edge-esmeralda";
import { edgeSa } from "./Forms/edge-sa";
import { edgeAustin } from "./Forms/edge-austin";
import { edgeBhutan2025 } from "./Forms/edge-bhutan";
import { edgePatagonia } from "./Forms/edge-patagonia";
import { icelandEclipsePreapproved } from "./Forms/iceland-eclipse-preapproved";
import { rippleOnTheNile } from "./Forms/ripple-on-the-nile";

// Custom field definition for popup-specific questions stored in JSONB
export type CustomField = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'boolean' | 'select';
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
}

export const dynamicForm: Record<string, DynamicForm | null> = {
  'default': edgeEsmeralda,
  'buenos-aires': edgeEsmeralda,
  "edge-esmeralda": edgeEsmeralda,
  "edge-austin": edgeAustin,
  'edge-sa': edgeSa,
  'edge-bhutan-2025': edgeBhutan2025,
  'edge-patagonia': edgePatagonia,
  'edge-esmeralda-2026': edgeEsmeralda,
  'iceland-eclipse-preapproved': icelandEclipsePreapproved,
  'ripple-on-the-nile': rippleOnTheNile,
}