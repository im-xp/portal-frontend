import { useMemo } from "react";
import SectionWrapper from "./SectionWrapper";
import { SectionSeparator } from "./section-separator";
import InputForm from "@/components/ui/Form/Input";
import TextAreaForm from "@/components/ui/Form/TextArea";
import CheckboxForm from "@/components/ui/Form/Checkbox";
import SelectForm from "@/components/ui/Form/Select";
import { useCityProvider } from "@/providers/cityProvider";
import { dynamicForm, CustomField } from "@/constants";

interface CustomFieldsFormProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  handleChange: (name: string, value: any) => void;
  section?: 'personal_information' | 'professional_details' | 'participation' | 'other';
}

export function CustomFieldsForm({ 
  formData, 
  errors, 
  handleChange, 
  section 
}: CustomFieldsFormProps) {
  const { getCity } = useCityProvider();
  const city = getCity();
  const form = dynamicForm[city?.slug ?? ''];
  
  const customFields = useMemo(() => {
    if (!form?.customFields) return [];
    return section 
      ? form.customFields.filter(f => f.section === section)
      : form.customFields;
  }, [form, section]);

  if (!customFields.length) return null;

  const shouldShowField = (field: CustomField) => {
    if (!field.showWhen) return true;
    const dependentValue = formData[`custom_${field.showWhen.field}`];
    return dependentValue === field.showWhen.value;
  };

  const renderField = (field: CustomField) => {
    if (!shouldShowField(field)) return null;
    
    // Use custom_ prefix for custom field keys to distinguish from standard fields
    const fieldKey = `custom_${field.key}`;
    const value = formData[fieldKey] ?? '';
    const error = errors[fieldKey];

    switch (field.type) {
      case 'text':
        return (
          <InputForm
            key={field.key}
            label={field.label}
            id={fieldKey}
            value={value}
            onChange={(val) => handleChange(fieldKey, val)}
            placeholder={field.placeholder}
            error={error}
            isRequired={field.required}
          />
        );

      case 'textarea':
        return (
          <TextAreaForm
            key={field.key}
            label={field.label}
            id={fieldKey}
            value={value}
            handleChange={(val) => handleChange(fieldKey, val)}
            placeholder={field.placeholder}
            error={error || ''}
            isRequired={field.required}
          />
        );

      case 'boolean':
        return (
          <CheckboxForm
            key={field.key}
            title={field.label}
            id={fieldKey}
            checked={!!value}
            onCheckedChange={(checked) => handleChange(fieldKey, checked)}
            required={field.required}
          />
        );

      case 'select':
        return (
          <SelectForm
            key={field.key}
            label={field.label}
            id={fieldKey}
            value={value}
            onChange={(val) => handleChange(fieldKey, val)}
            options={field.options || []}
            placeholder={field.placeholder || 'Select an option'}
            error={error}
            isRequired={field.required}
          />
        );

      default:
        return null;
    }
  };

  // For "other" section, render with a wrapper
  if (section === 'other') {
    return (
      <>
        <SectionSeparator />
        <SectionWrapper
          title="Additional Questions"
          subtitle="A few more questions to help us understand you better"
        >
          <div className="space-y-6">
            {customFields.map(renderField)}
          </div>
        </SectionWrapper>
      </>
    );
  }

  // For other sections (personal_information, professional_details, participation),
  // just render the fields inline (they'll be added to existing section)
  return (
    <div className="space-y-6 mt-6">
      {customFields.map(renderField)}
    </div>
  );
}

export default CustomFieldsForm;

