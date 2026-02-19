"use client"

import { useState, useCallback } from "react"
import SectionWrapper from "./SectionWrapper"
import { SignatureModal } from "./signature-modal"
import PdfViewer from "./pdf-viewer"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { LabelRequired } from "@/components/ui/label"
import { FormInputWrapper } from "@/components/ui/form-input-wrapper"
import { SectionSeparator } from "./section-separator"
import { SectionProps } from "@/types/Section"
import { Pencil } from "lucide-react"

const PDF_PATH = "/Agreement_eclipse.pdf"

export const AgreementForm = ({ formData, errors, handleChange }: SectionProps) => {
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)

  const handleSignatureSave = useCallback(
    (signatureDataUrl: string) => {
      handleChange("custom_agreement_signature", signatureDataUrl)
    },
    [handleChange]
  )

  const handleOpenSignatureModal = useCallback(() => {
    setIsSignatureModalOpen(true)
  }, [])

  const handleCloseSignatureModal = useCallback(() => {
    setIsSignatureModalOpen(false)
  }, [])

  const signatureValue = formData.custom_agreement_signature as string

  return (
    <>
      <SectionWrapper title="Agreement">
        <div className="space-y-6">
          <PdfViewer filePath={PDF_PATH} />

          <FormInputWrapper>
            <div className="flex items-start gap-3">
              <Checkbox
                id="custom_agreement_consent"
                checked={!!formData.custom_agreement_consent}
                onCheckedChange={(checked) =>
                  handleChange("custom_agreement_consent", !!checked)
                }
                className="mt-1"
                aria-label="Agreement consent checkbox"
              />
              <label
                htmlFor="custom_agreement_consent"
                className="text-sm leading-relaxed cursor-pointer"
              >
                By checking this box, I acknowledge and agree that my electronic
                signature shall have the same legal effect as a physical signature,
                and I consent to sign this Agreement digitally. I understand that
                checking this box constitutes my agreement to the terms and
                conditions outlined in the Agreement for the Event.{" "}
                <span className="text-destructive">*</span>
              </label>
            </div>
            {errors.custom_agreement_consent && (
              <p className="text-destructive text-sm mt-1">
                {errors.custom_agreement_consent}
              </p>
            )}
          </FormInputWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInputWrapper>
              <LabelRequired isRequired>Signature</LabelRequired>
              {signatureValue ? (
                <div className="relative">
                  <div className="border border-border rounded-md p-3 bg-white flex items-center justify-center min-h-[60px]">
                    <img
                      src={signatureValue}
                      alt="Your signature"
                      className="max-h-[50px] object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenSignatureModal}
                    className="absolute top-2 right-2 p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Change signature"
                    tabIndex={0}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenSignatureModal}
                  className="flex items-center gap-2 border border-border rounded-md px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors w-fit"
                  aria-label="Add signature"
                  tabIndex={0}
                >
                  <Pencil className="h-4 w-4" />
                  Add signature
                </button>
              )}
              {errors.custom_agreement_signature && (
                <p className="text-destructive text-sm mt-1">
                  {errors.custom_agreement_signature}
                </p>
              )}
            </FormInputWrapper>

            <FormInputWrapper>
              <LabelRequired isRequired>Today&apos;s Date</LabelRequired>
              <Input
                type="date"
                id="custom_agreement_date"
                value={(formData.custom_agreement_date as string) ?? ""}
                onChange={(e) => handleChange("custom_agreement_date", e.target.value)}
                error={errors.custom_agreement_date}
                aria-label="Agreement date"
              />
              {errors.custom_agreement_date && (
                <p className="text-destructive text-sm mt-1">
                  {errors.custom_agreement_date}
                </p>
              )}
            </FormInputWrapper>
          </div>
        </div>
      </SectionWrapper>

      <SignatureModal
        open={isSignatureModalOpen}
        onClose={handleCloseSignatureModal}
        onSave={handleSignatureSave}
      />

      <SectionSeparator />
    </>
  )
}
