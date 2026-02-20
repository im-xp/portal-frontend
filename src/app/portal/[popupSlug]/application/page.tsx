"use client"

import { ButtonAnimated } from "@/components/ui/button"
import { useFormValidation } from "@/hooks/useFormValidation"
import { toast } from "sonner"
import { Loader } from '../../../../components/ui/Loader'
import { ExistingApplicationCard } from './components/existing-application-card'
import { FormHeader } from './components/form-header'
import { SectionSeparator } from './components/section-separator'
import { PersonalInformationForm } from './components/personal-information-form'
import { ProfessionalDetailsForm } from './components/professional-details-form'
import { ParticipationForm } from './components/participation-form'
import { ChildrenPlusOnesForm } from './components/children-plus-ones-form'
import { ScholarshipForm } from './components/scholarship-form'
import { ProgressBar } from './components/progress-bar'
import useSavesForm from './hooks/useSavesForm'
import useProgress from './hooks/useProgress'
import { initial_data } from './helpers/constants'
import useInitForm from './hooks/useInitForm'
import { useCityProvider } from "@/providers/cityProvider"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AccomodationForm from "./components/AccomodationForm"
import { useApplication } from "@/providers/applicationProvider"
import useGetFields from "./hooks/useGetFields"
import PatagoniaResidenciesForm from "./components/PatagoniaResidenciesForm"
import { CustomFieldsForm } from "./components/CustomFieldsForm"
import { WorkExchangeHeader } from "./components/work-exchange-header"
import { AboutYouForm } from "./components/about-you-form"
import { ContactInformationForm } from "./components/contact-information-form"
import { ExperienceForm } from "./components/experience-form"
import { SpecialAccommodationsForm } from "./components/special-accommodations-form"
import { AvailabilityTeamForm } from "./components/availability-team-form"
import { AgreementForm } from "./components/agreement-form"
import useApplicationFee from "./hooks/useApplicationFee"
import { ApplicationFeeBanner } from "./components/application-fee-banner"

export default function FormPage() {
  const [statusBtn, setStatusBtn] = useState({loadingDraft: false, loadingSubmit: false})
  const { formData, errors, handleChange, validateForm, setFormData } = useFormValidation(initial_data)
  const { isLoading: isLoadingForm, showExistingCard, existingApplication, setShowExistingCard } = useInitForm(setFormData)
  const { handleSaveForm, handleSaveDraft } = useSavesForm()
  const { getCity } = useCityProvider()
  const { getRelevantApplication } = useApplication()
  const { fields } = useGetFields()
  const progress = useProgress(formData)
  const city = getCity()
  const application = getRelevantApplication()
  const router = useRouter()
  const { hasApplicationFee, applicationFee, isFeePaid, loading: feeLoading, createFeePayment } = useApplicationFee()
  const requiresFeePayment = hasApplicationFee && !isFeePaid

  useEffect(() => {
    if(city && city.slug && fields?.size === 0) {
      router.push(`/portal/${city?.slug}`)
      return;
    }
    if(application && (application.status === 'accepted' || application.status === 'rejected')) {
      router.push(`/portal/${city?.slug}`)
    }
  }, [application, city, fields])

  const handleImport = async () => {
    if (existingApplication && fields) {
      const filteredData = Object.fromEntries(
        Object.entries(existingApplication).filter(([key]) => fields.has(key))
      );
      setFormData(filteredData as Record<string, any>);
      setShowExistingCard(false);
      toast.success("Previous application data imported successfully");
    }
  }

  const handleCancelImport = () => {
    setShowExistingCard(false);
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setStatusBtn({loadingDraft: false, loadingSubmit: true})
    const formValidation = validateForm()

    if (!formValidation.isValid) {
      toast.error("Error", {
        description: "Please fill in all required fields",
      })
      setStatusBtn({loadingDraft: false, loadingSubmit: false})
      return
    }

    if (requiresFeePayment) {
      const draftResponse = await handleSaveDraft(formData, { silent: true })
      const applicationId = draftResponse?.data?.id ?? application?.id
      if (!applicationId) {
        toast.error("Error", { description: "Could not save your application. Please try again." })
        setStatusBtn({loadingDraft: false, loadingSubmit: false})
        return
      }

      try {
        const feePayment = await createFeePayment(applicationId)
        if (feePayment?.checkout_url) {
          const checkoutUrl = new URL(feePayment.checkout_url)
          checkoutUrl.searchParams.set('redirect_url', `${window.location.origin}/portal`)
          window.location.href = checkoutUrl.toString()
          return
        }
        toast.error("Error", { description: "Could not create the payment. Please try again." })
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not process the payment. Please try again."
        toast.error("Payment Error", { description: message })
      }

      setStatusBtn({loadingDraft: false, loadingSubmit: false})
      return
    }

    await handleSaveForm(formData)
    setStatusBtn({loadingDraft: false, loadingSubmit: false})
  }

  const handleDraft = async() => {
    setStatusBtn({loadingDraft: true, loadingSubmit: false})
    await handleSaveDraft(formData)
    setStatusBtn({loadingDraft: false, loadingSubmit: false})
  }

  if (isLoadingForm || !city) {
    return <Loader />
  }

  if(!fields || !fields.size) return null

  return (
    <main className="container py-6 md:py-12 mb-8">
      {showExistingCard && existingApplication && (
        <ExistingApplicationCard onImport={handleImport} onCancel={handleCancelImport} data={existingApplication} />
      )}
      <form onSubmit={handleSubmit} className="space-y-8 px-8 md:px-12">
        {/* <FormHeader /> */}
        <WorkExchangeHeader />
        <SectionSeparator />

          <AboutYouForm formData={formData} errors={errors} handleChange={handleChange} fields={fields} />
   

          <ContactInformationForm formData={formData} errors={errors} handleChange={handleChange} fields={fields} />
    
          <ExperienceForm formData={formData} errors={errors} handleChange={handleChange} fields={fields} />


          <SpecialAccommodationsForm formData={formData} errors={errors} handleChange={handleChange} fields={fields} />

          <AvailabilityTeamForm formData={formData} errors={errors} handleChange={handleChange} fields={fields} />
        

          <AgreementForm formData={formData} errors={errors} handleChange={handleChange} fields={fields} />
        

        {requiresFeePayment && (
          <ApplicationFeeBanner amount={applicationFee} />
        )}

        <div className="flex flex-col w-full gap-6 md:flex-row justify-between items-center pt-6">
          <ButtonAnimated loading={statusBtn.loadingDraft} disabled={statusBtn.loadingSubmit || feeLoading} variant="outline" type="button" onClick={handleDraft} className="w-full md:w-auto">Save as draft</ButtonAnimated>
          <ButtonAnimated loading={statusBtn.loadingSubmit || feeLoading} disabled={statusBtn.loadingDraft} type="submit" className="w-full md:w-auto">
            {requiresFeePayment ? `Pay & Submit ($${applicationFee.toFixed(2)})` : "Submit"}
          </ButtonAnimated>
        </div>

      </form>
      <ProgressBar progress={progress} />
    </main>
  )
}

