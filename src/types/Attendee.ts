import { ProductsPass, ProductsProps } from "./Products";

export type AttendeeCategory = "main" | "spouse" | 'kid' | 'baby' | 'teen'

export interface AttendeeProps {
  id: number;
  name: string;
  email: string;
  check_in_code?: string;
  category: AttendeeCategory;
  application_id: number;
  gender: string;
  products: ProductsPass[]
}

export interface AttendeeCustomData {
  short_bio?: string;
  headshot_url?: string;
  expectations?: string;
  egypt_experience?: string;
  gifts_to_contribute?: string;
  anything_else?: string;
  [key: string]: string | undefined; // Allow other custom fields
}

export interface AttendeeDirectory {
  id: number;
  citizen_id: number;
  brings_kids: string | boolean | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  telegram: string | null;
  participation: string | ProductsProps[];
  role: string | null;
  organization: string | null;
  // Extended profile fields
  picture_url: string | null;
  personal_goals: string | null;
  social_media: string | null;
  residence: string | null;
  builder_description: string | null;
  age: string | null;
  gender: string | null;
  // Custom data from popup-specific questions
  custom_data: AttendeeCustomData | null;
}

export interface CreateAttendee {
  name: string, 
  email: string, 
  category: AttendeeCategory,
  gender: string
}
