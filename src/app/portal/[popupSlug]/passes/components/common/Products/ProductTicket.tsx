import { ProductsPass } from "@/types/Products"
import { Plus, Ticket, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/helpers/dates"
import { usePassesProvider } from "@/providers/passesProvider"
import { TooltipContent } from "@/components/ui/tooltip"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import ProductDay from "./ProductDay"
import { Separator } from "@/components/ui/separator"

type VariantStyles = 'selected' | 'purchased' | 'edit' | 'disabled' | 'default' | 'week-with-month'

const variants: Record<VariantStyles, string> = {
  selected: 'bg-primary/20 border-primary text-primary-foreground hover:bg-primary/30',
  purchased: 'bg-background text-foreground border-border',
  edit: 'bg-secondary/30 border-dashed border-border text-card-foreground border',
  disabled: 'bg-muted/50 text-muted-foreground cursor-not-allowed',
  default: 'bg-card border-border text-card-foreground hover:bg-secondary/50',
  'week-with-month': 'bg-accent/20 border-accent text-accent-foreground hover:bg-accent/30',
}

const Product = ({product, onClick, defaultDisabled, hasMonthPurchased}: {product: ProductsPass, onClick: (attendeeId: number | undefined, product: ProductsPass) => void, defaultDisabled?: boolean, hasMonthPurchased?: boolean}) => {
  const disabled = product.disabled || defaultDisabled
  const originalPrice = product.original_price ?? product.price
  const { purchased, selected } = product
  const { isEditing } = usePassesProvider()
  
  // Check if this is a week product with month purchased/selected from same attendee
  const isWeekWithMonth = (product.category === 'week' || product.category === 'local week') && hasMonthPurchased && !product.purchased

  if (product.category.includes('day')) { 
    return <ProductDay product={product} onClick={onClick} defaultDisabled={defaultDisabled} hasMonthPurchased={hasMonthPurchased}/>
  }

  return (
    <button 
      onClick={disabled || (purchased && !isEditing) ? undefined : () => onClick(product.attendee_id, product)}
      disabled={disabled || (purchased && !isEditing)}
      className={cn(
        'flex items-center gap-2 border rounded-md p-2 relative',
        variants[
          (selected && purchased && !disabled) ? 'edit' : 
          purchased ? 'purchased' : 
          disabled ? 'disabled' : 
          isWeekWithMonth ? 'week-with-month' :
          selected ? 'selected' : 
          'default'
        ]
      )}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center justify-center">
          <div className="pl-2">
            <Ticket className="w-4 h-4" />
          </div>
          <div className="flex flex-col pl-3 ">
            <p className="font-semibold text-sm text-left">{product.name}</p>

            {
              product.start_date && product.end_date && (
                <span className={cn('text-xs text-left text-primary', disabled && 'text-muted-foreground')}>
                  {formatDate(product.start_date, {day: 'numeric', month: 'short'})} to {formatDate(product.end_date, {day: 'numeric', month: 'short'})}
                </span>
              )
            }
          </div>
        </div>

        <div className="flex items-center gap-2">

          {
            product.description && !product.purchased && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent className="bg-card text-card-foreground shadow-md border border-border max-w-sm">
                  {product.description}
                </TooltipContent>
              </Tooltip>
            )
          }
          
          {
            !product.purchased && !isWeekWithMonth && (
              <>
                {
                  originalPrice !== product.price && (
                    <p className={cn("text-xs text-muted-foreground line-through", disabled && 'opacity-50')}>
                      ${originalPrice.toLocaleString()}
                    </p>
                  )
                }
                <p className={cn("text-md font-medium", disabled && 'opacity-50')}>$ {product.price.toLocaleString()}</p>
              </>
            )
          }

        </div>
      </div>
    </button>
  )
}

export default Product