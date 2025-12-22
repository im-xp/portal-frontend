import { useEffect, useState } from "react";
import { toast } from "sonner";
import useGetData from "./useGetData";
import { useCityProvider } from "@/providers/cityProvider";

const useInitForm = (setFormData: any) => {
  const [isLoading, setIsLoading] = useState(true)
  const [showExistingCard, setShowExistingCard] = useState(false)
  const [existingApplication, setExistingApplication] = useState<any>(null)
  const { getDataApplicationForm } = useGetData()
  const { getCity, getPopups } = useCityProvider()
  const city = getCity()
  const popups = getPopups()

  useEffect(() => {
    const initializeForm = async () => {
      setIsLoading(true)
      try {
        const { application, status } = await getDataApplicationForm()

        if(!application || !status) return

        if (status === 'import') {
          setExistingApplication(application);
          setShowExistingCard(true);
        }

        if (status === 'draft') {
          // Extract custom_data fields and prefix them with 'custom_'
          const customDataFields: Record<string, any> = {};
          if (application.custom_data && typeof application.custom_data === 'object') {
            for (const [key, value] of Object.entries(application.custom_data)) {
              customDataFields[`custom_${key}`] = value;
            }
          }
          
          // Remove custom_data from application since we've extracted it
          const { custom_data, ...applicationData } = application;
          
          setFormData((prevData: any) => ({
            ...prevData,
            ...applicationData,
            ...customDataFields,
          }));
        }
      } catch (error) {
        console.error("Error initializing form:", error);
        toast.error("Error", {
          description: "There was an error loading your application data. Please try again.",
        });
      } finally {
        setIsLoading(false)
      }
    }

    initializeForm();
  }, [city, popups]);

  return { isLoading, showExistingCard, existingApplication, setShowExistingCard }
}
export default useInitForm