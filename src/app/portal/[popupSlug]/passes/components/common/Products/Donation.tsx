import { cn } from "@/lib/utils";
import { ProductsPass } from "@/types/Products";
import { Check, ChevronDown, Heart } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { isSoldOut } from "@/helpers/inventory";

interface DonationProps {
  product: ProductsPass;
  onDonationSubmit: (amount: number) => void;
  disabled?: boolean;
}

const PRESET_AMOUNTS = [100, 1000, 10000];

export default function Donation({ product, onDonationSubmit, disabled }: DonationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<string>(product.custom_price?.toString() || "");
  const [error, setError] = useState<string>("");
  
  const { selected, purchased, custom_price } = product;
  const soldOut = isSoldOut(product);
  const isDisabled = disabled || soldOut;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      setError("");
    }
  };

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount)) {
      setError("Please enter a valid amount");
      return;
    }
    
    if (numAmount < 1) {
      setError("Minimum donation is $1");
      return;
    }
    
    setError("");
    onDonationSubmit(numAmount);
    setIsOpen(false);
  };

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString());
    setError("");
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "w-full border rounded-lg transition-colors",
        selected 
          ? "bg-rose-500/10 border-rose-500/50" 
          : "bg-card border-border hover:border-rose-500/30",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <CollapsibleTrigger 
        className="w-full p-4 flex items-center justify-between gap-3 text-left"
        disabled={isDisabled}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-full",
            selected ? "bg-rose-500/20" : "bg-muted"
          )}>
            <Heart className={cn(
              "w-5 h-5",
              selected ? "text-rose-500 fill-rose-500" : "text-muted-foreground"
            )} />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-semibold",
              selected && "text-rose-500"
            )}>
              {product.name}
            </span>
            <span className={cn("text-sm text-muted-foreground", soldOut && "text-destructive/70")}>
              {soldOut
                ? "Sold Out"
                : selected && custom_price 
                  ? `$${custom_price.toLocaleString()} selected`
                  : purchased 
                    ? "Thank you for your donation!"
                    : "Support someone's journey to Ripple"
              }
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {selected && custom_price && (
            <span className="font-semibold text-rose-500">
              ${custom_price.toLocaleString()}
            </span>
          )}
          <ChevronDown className={cn(
            "w-5 h-5 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )} />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Interested in supporting someone else's journey or enhancing the container from afar? 
            Please consider donating directly to Ripple on the Nile.
          </p>

          {/* Preset amounts */}
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  "px-4 py-2 rounded-md border text-sm font-medium transition-colors",
                  amount === preset.toString()
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-card border-border hover:border-rose-500/50 hover:bg-rose-500/10"
                )}
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Custom amount input */}
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter custom amount"
                className={cn("pl-7", error && "border-red-500")}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white"
            disabled={!amount}
          >
            {selected ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Update Donation
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Add Donation
              </>
            )}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
