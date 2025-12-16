import { AttendeeProps } from "@/types/Attendee"
import { ChevronRight, Home } from "lucide-react"
import { ProductsPass } from "@/types/Products"
import { useCityProvider } from "@/providers/cityProvider"
import { EdgeLand } from "@/components/Icons/EdgeLand"
import Product from "./Products/ProductTicket"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import React, { useState } from "react"

interface LodgingTicketProps {
  attendee: AttendeeProps
  toggleProduct?: (attendeeId: number, product: ProductsPass) => void
}

const LodgingTicket = ({ attendee, toggleProduct }: LodgingTicketProps) => {
  const lodgingProducts = attendee.products
    .filter((product) => product.category === 'lodging')
    .sort((a, b) => a.price - b.price)
  
  const { getCity } = useCityProvider()
  const city = getCity()
  const [lodgingOpen, setLodgingOpen] = useState(true)

  if (lodgingProducts.length === 0) {
    return null
  }

  return (
    <div className="relative h-full w-full">
      <div className="w-full overflow-hidden">
        <div className="w-full rounded-3xl border border-gray-200 h-full xl:grid xl:grid-cols-[1fr_2px_2fr] bg-white">

          <div className="relative flex flex-col p-6 overflow-hidden h-full">
            <div 
              className="absolute inset-0 z-0 rounded-3xl"
              style={{
                background: `linear-gradient(0deg, transparent, rgba(255, 255, 255, 0.8) 20%, #FFFFFF 90%), url(${city?.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
              }}
            />
            <div className="z-10 h-full flex xl:flex-col justify-between xl:justify-start xl:gap-10">
              <div className="flex flex-col justify-center xl:order-2">
                <p className="text-xl font-semibold">Lodging</p>
                <div className="flex items-center gap-2 mt-1">
                  <Home className="h-4 w-4 text-gray-500"/>
                  <p className="text-sm text-foreground underline hover:text-primary transition-colors duration-200"><a href="https://imxp.notion.site/The-Portal-Housing-2c5ec4424fdb805090acd58f4f0679bf?pvs=143" target="_blank" rel="noopener noreferrer">View all Housing Options</a></p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 xl:order-1">
                  <p className="text-sm font-medium">{city?.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-r-2 border-dashed border-gray-200 self-stretch relative">
            <div className="absolute -top-[23px] -left-[23px] w-[48px] h-[46px] bg-neutral-100 rounded-3xl border border-gray-200"></div>
            <div className="absolute max-xl:-top-[23px] max-xl:-right-[23px] xl:-bottom-[23px] xl:-right-auto xl:-left-[23px] w-[48px] h-[46px] bg-neutral-100 rounded-3xl border border-gray-200"></div> 
          </div>

          <div className="flex flex-col p-8 gap-2 xl:pr-10">
            <Collapsible open={lodgingOpen} onOpenChange={setLodgingOpen} className="space-y-2">
              <CollapsibleTrigger className="w-full bg-accent rounded-md" aria-label="Toggle Lodging Options">
                <div className="flex justify-between items-center p-3">
                  <div className="flex items-center gap-2">
                    <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", lodgingOpen && "transform rotate-90")} />
                    <span className="font-medium">Available Rooms</span>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="transition-all duration-100 ease-in-out data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                <div className="flex flex-col gap-2">
                  {lodgingProducts.map((product) => (
                    <React.Fragment key={`${product.id}-${attendee.id}`}>
                      <Product 
                        product={product} 
                        defaultDisabled={!toggleProduct} 
                        hasMonthPurchased={false}
                        onClick={toggleProduct ? (attendeeId, product) => toggleProduct(attendeeId ?? 0, product) : () => {}}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LodgingTicket