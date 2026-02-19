# Application Form - Context for AI

## Project Overview

This is a **Next.js** portal frontend (React, TypeScript, TailwindCSS, Shadcn/Radix UI) that renders dynamic application forms for different popup events. Each popup (identified by a URL slug like `iceland-eclipse-preapproved`, `edge-patagonia`, etc.) shows a different subset of fields and sections.

---

## Architecture

### How fields are controlled per popup

Each popup has a config file in `src/constants/Forms/`. The config defines which standard fields to show and optional custom fields.

**Config type** (`src/constants/index.ts`):
```ts
export type DynamicForm = {
  local?: string,
  personal_information?: { title?: string, subtitle?: string, residence_placeholder?: string, local_resident_title?: string, [key: string]: any },
  professional_details?: { title?: string, subtitle?: string, [key: string]: any },
  participation?: { title?: string, subtitle?: string, duration_label?: string, duration_subtitle?: string, [key: string]: any },
  scholarship?: { title?: string, subtitle?: string, interest_text?: string, scholarship_request?: string, [key: string]: any },
  accommodation?: { title?: string, subtitle?: string, [key: string]: any },
  fields: string[],          // Standard fields to display (stored as individual DB columns)
  customFields?: CustomField[], // Extra popup-specific fields (stored in custom_data JSONB)
}
```

**Slug-to-config mapping** (`src/constants/index.ts`):
```ts
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
```

**Hook `useGetFields`** (`src/app/portal/[popupSlug]/application/hooks/useGetFields.ts`):
Reads the config's `fields` array and returns a `Set<string>` that each form section uses to conditionally render fields via `fields.has("field_name")`.

### Standard fields (known DB columns, from edge-patagonia as reference)

These are stored as individual columns in the `applications` table:
```
first_name, last_name, gender, gender_specify, age, telegram, residence,
eth_address, referral, local_resident, info_not_shared, organization, role,
social_media, duration, builder_boolean, builder_description, hackathon_interest,
investor, video_url, personal_goals, host_session, brings_spouse, brings_kids,
spouse_info, spouse_email, kids_info, scholarship_interest, scholarship_info,
scholarship_details, scholarship_video_url, scholarship_request,
patagonia_residencies, scholarship_volunteer
```

### Custom fields (stored in `custom_data` JSONB column)

Any field name prefixed with `custom_` in formData is automatically extracted at submit time and placed inside `custom_data: {...}` (with the prefix stripped). This logic lives in `useSavesForm.ts` `processFormData()`:

```ts
for (const [key, value] of Object.entries(processedData)) {
  if (key.startsWith('custom_')) {
    const customKey = key.replace('custom_', '');
    customData[customKey] = value;
  } else {
    standardData[key] = value;
  }
}
// Result: { ...standardData, custom_data: customData }
```

---

## Form Page Structure

**File: `src/app/portal/[popupSlug]/application/page.tsx`**

The main form page renders sections in this order:
1. `WorkExchangeHeader` - Informational header (Iceland Eclipse specific currently)
2. `AboutYouForm` - Custom "About You" section (conditionally for `iceland-eclipse-preapproved`)
3. `PersonalInformationForm` - Standard personal info (first_name, last_name, gender, etc.)
4. `CustomFieldsForm section="personal_information"` - Extra custom fields for this section
5. `ProfessionalDetailsForm` - Organization, role, social_media
6. `CustomFieldsForm section="professional_details"`
7. `ParticipationForm` - Duration, builder info, hackathon, video, goals
8. `CustomFieldsForm section="participation"`
9. `PatagoniaResidenciesForm` - Patagonia-specific
10. `ChildrenPlusOnesForm` - Spouse/kids info
11. `ScholarshipForm` - Scholarship interest and details
12. `AccomodationForm` - Accommodation/booking
13. `CustomFieldsForm section="other"` - Catch-all custom section
14. Submit / Draft buttons

Each section component checks `fields.has("field_name")` before rendering each field. If NONE of the section's fields are in the Set, the section returns `null`.

---

## UI Component Library (How inputs are styled)

All form inputs follow a consistent pattern using wrapper components. **Any new form fields MUST use these same components to maintain visual consistency.**

### Layout Wrapper

**`SectionWrapper`** (`src/app/portal/[popupSlug]/application/components/SectionWrapper.tsx`):
```tsx
// Two-column layout: left side = title/subtitle, right side = form fields
// Uses framer-motion for scroll-in animation
<motion.div className="grid gap-10 xl:grid-cols-[260px,1fr] pb-12">
  <div className="space-y-1">
    <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
    <p className="text-muted-foreground">{subtitle}</p>
  </div>
  <div className="space-y-6">{children}</div>
</motion.div>
```

**`SectionSeparator`**: Simple `<div className="h-px bg-gray-200" />` between sections.

**`FormInputWrapper`** (`src/components/ui/form-input-wrapper.tsx`):
```tsx
<div className="space-y-2">{children}</div>
```

### Input Components

All at `src/components/ui/Form/`:

**`InputForm`** - Text input:
```tsx
<InputForm
  label="Field Label"
  id="field_id"
  value={formData.field_id}
  onChange={(value) => handleChange('field_id', value)}
  error={errors.field_id}
  isRequired={true}
  subtitle="Optional helper text"
  placeholder="Optional placeholder"
/>
```

**`AddonInputForm`** - Input with prefix addon (e.g. "@" for telegram):
```tsx
<AddonInputForm label="Telegram" id="telegram" value={formData.telegram}
  onChange={(value) => handleChange('telegram', value)} error={errors.telegram}
  isRequired addon="@" placeholder="username" subtitle="..." />
```

**`SelectForm`** - Dropdown select:
```tsx
<SelectForm
  label="Label"
  id="field_id"
  value={formData.field_id}
  onChange={(value) => handleChange('field_id', value)}
  error={errors.field_id}
  isRequired={true}
  placeholder="Select..."
  options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]}
/>
```

**`TextAreaForm`** - Textarea:
```tsx
<TextAreaForm
  label="Label"
  id="field_id"
  value={formData.field_id ?? ''}
  error={errors.field_id}
  handleChange={(value) => handleChange('field_id', value)}
  isRequired
  subtitle="Optional subtitle"
/>
```

**`CheckboxForm`** - Checkbox with optional title:
```tsx
<CheckboxForm
  title="Optional Title Above"     // Bold label above
  label="Checkbox label text"      // Muted label next to checkbox
  id="field_id"
  checked={formData.field_id}
  onCheckedChange={(checked) => handleChange('field_id', checked)}
  required={true}
  subtitle="Optional subtitle"
  error={errors.field_id}
/>
```

**`RadioGroupForm`** - Radio group in a grid:
```tsx
<RadioGroupForm
  label="Question?"
  subtitle="Helper text"
  value={formData.field_id}
  onChange={(value) => handleChange('field_id', value)}
  error={errors.field_id}
  isRequired
  options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]}
/>
```

### Label Components (`src/components/ui/label.tsx`)

- `LabelRequired` - Shows a `*` indicator when `isRequired` is true
- `LabelMuted` - Muted text color for subtitles/help text
- `Label` - Base label

### Grid Patterns Used in Sections

- Two-column grid for inputs: `<div className="grid gap-4 sm:grid-cols-2">`
- Full-width single field: just render the component without grid
- Fields with conditional sub-fields use `AnimatePresence` + `motion.div`

---

## Validation System

**File: `src/hooks/useFormValidation.ts`**

Two validation mechanisms:

1. **Standard fields**: Defined in `requiredFields` object, validated only if the field is in the `fields` Set:
```ts
const requiredFields = {
  personalInformation: ['first_name', 'last_name', 'telegram', 'gender', 'age', 'email', 'gender_specify', 'local_resident'],
  professionalDetails: ['organization'],
  participation: ['duration', 'builder_description'],
  childrenPlusOnes: ['spouse_info', 'spouse_email', 'kids_info'],
  scholarship: ['scholarship_video_url', 'scholarship_details'],
  accommodation: ['booking_confirmation'],
}
```

2. **Custom required fields per slug**: Defined in `customRequiredFieldsBySlug`, these bypass the `fields.has()` check:
```ts
const customRequiredFieldsBySlug: Record<string, string[]> = {
  'iceland-eclipse-preapproved': [
    'custom_data_privacy_consent', 'custom_full_name',
    'custom_ticket_type', 'custom_city_town', 'residence',
  ],
}
```

The `validateForm()` function iterates both lists and collects errors.

### `handleChange` signature:
```ts
handleChange: (name: string, value: string | string[] | boolean) => void
```

---

## Initial Form Data

**File: `src/app/portal/[popupSlug]/application/helpers/constants.ts`**

All fields must have initial values here:
```ts
export const initial_data = {
  first_name: '', last_name: '', email: '', telegram: '',
  organization: '', gender: '', age: '', social_media: '',
  residence: '', local_resident: null,
  role: '', duration: '',
  area_of_expertise: '', preferred_dates: '',
  hackathon_interest: false, host_session: '', personal_goals: '',
  builder_boolean: false, builder_description: '',
  brings_spouse: false, spouse_info: '', spouse_email: '',
  brings_kids: false, kids_info: '',
  scholarship_request: false, video_url: '',
  is_renter: false, booking_confirmation: '',
  eth_address: '', referral: '', info_not_shared: [],
  investor: false, github_profile: '', minting_link: '',
  residencies_interested_in: [], residencies_text: '',
  send_note_to_applicant: '',
  // Iceland Eclipse custom fields
  custom_data_privacy_consent: false,
  custom_full_name: '',
  custom_has_chosen_name: false,
  custom_ticket_type: '',
  custom_city_town: '',
}
```

---

## Example: AboutYouForm (recently created)

**File: `src/app/portal/[popupSlug]/application/components/about-you-form.tsx`**

This is a dedicated section component for `iceland-eclipse-preapproved` that demonstrates:
- Using `SectionWrapper` with title "About You"
- Using `custom_` prefix for non-standard fields
- Using raw `Checkbox` from Shadcn for inline checkboxes (not `CheckboxForm`)
- Using a `Command` + `Popover` combobox for country selection (searchable dropdown)
- Using `InputForm` for text fields
- Using `LabelRequired` for custom label layouts
- Using `FormInputWrapper` for spacing
- Section ends with `<SectionSeparator />`

Currently rendered conditionally: `{city?.slug === 'iceland-eclipse-preapproved' && <AboutYouForm ... />}`

---

## Shared SectionProps Interface

```ts
// src/types/Section.ts
export interface SectionProps {
  formData: any;
  errors: Record<string, string>;
  handleChange: (name: string, value: string | string[] | boolean) => void;
  fields: Set<string> | null;
}
```

All section components receive these props.

---

## Key File Paths

| Purpose | Path |
|---|---|
| Main form page | `src/app/portal/[popupSlug]/application/page.tsx` |
| Form section components | `src/app/portal/[popupSlug]/application/components/` |
| Form constants (initial data) | `src/app/portal/[popupSlug]/application/helpers/constants.ts` |
| Form-specific constants (options) | `src/app/portal/[popupSlug]/application/constants/forms.ts` |
| Country list | `src/app/portal/[popupSlug]/application/constants/countries.ts` |
| Popup form configs | `src/constants/Forms/*.ts` |
| Config types + slug mapping | `src/constants/index.ts` |
| UI form components | `src/components/ui/Form/` (Input, Select, Checkbox, TextArea, RadioGroup) |
| UI primitives | `src/components/ui/` (checkbox, label, form-input-wrapper, command, popover) |
| Validation hook | `src/hooks/useFormValidation.ts` |
| Submit/save hook | `src/app/portal/[popupSlug]/application/hooks/useSavesForm.ts` |
| Fields hook | `src/app/portal/[popupSlug]/application/hooks/useGetFields.ts` |
| Section type | `src/types/Section.ts` |

---

## Rules for Adding New Form Fields

1. **All popups**: Changes to form sections apply to ALL popups. Each popup config's `fields` array controls visibility. If a popup doesn't include a field in its `fields` array, it won't render.

2. **Standard fields** (in DB columns): Add the field name to the relevant popup config `fields` arrays, add initial value to `initial_data`, and use `fields.has("field_name")` to conditionally render.

3. **Custom fields** (in `custom_data` JSONB): Prefix the formData key with `custom_` (e.g., `custom_my_field`). The submit logic strips the prefix and nests it in `custom_data`. Add initial value to `initial_data`. Add to `customRequiredFieldsBySlug` if required.

4. **Style consistency**: ALWAYS use the existing UI form components (`InputForm`, `SelectForm`, `CheckboxForm`, `TextAreaForm`, `RadioGroupForm`). Wrap sections in `SectionWrapper`. Use `FormInputWrapper` for custom layouts. Use `grid gap-4 sm:grid-cols-2` for two-column input grids.

5. **Validation**: Add required fields to either `requiredFields` (standard) or `customRequiredFieldsBySlug` (custom per slug) in `useFormValidation.ts`.

6. **Errors display**: Use `text-red-500 text-sm` for error messages (or `text-destructive text-sm` which is equivalent in this theme).
