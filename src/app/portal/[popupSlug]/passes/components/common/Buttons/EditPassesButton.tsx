import { Button } from "@/components/ui/button"
import { usePassesProvider } from "@/providers/passesProvider"
import { PencilIcon, XIcon } from "lucide-react"

interface EditPassesButtonProps {
  onSwitchToBuy?: () => void;
}

const EditPassesButton = ({ onSwitchToBuy }: EditPassesButtonProps) => {
  const { toggleEditing, isEditing, attendeePasses } = usePassesProvider()

  const somePurchased = attendeePasses.some(attendee => attendee.products.some(product => product.purchased))

  if(!somePurchased) return null

  const handleEditClick = () => {
    toggleEditing();
    
    // If we're enabling edit mode and we have the switch function, call it
    if (!isEditing && onSwitchToBuy) {
      onSwitchToBuy();
    }
  };

  if(isEditing){
    return(
      <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-primary bg-transparent" onClick={() => toggleEditing()}>
        <XIcon className="w-4 h-4" />
        Cancel Pass Editing
      </Button>

    )
  }

  return (
    <Button variant="default" onClick={handleEditClick}>
      <PencilIcon className="w-4 h-4" />
      Edit Passes
    </Button>
  )

}

export default EditPassesButton