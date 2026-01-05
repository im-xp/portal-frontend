import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ProductsPass } from "@/types/Products";
import { Check, Crown, Info, Plus } from 'lucide-react'
import { cn } from "@/lib/utils";
import { isSoldOut } from "@/helpers/inventory";

// HOC para manejar la lógica de presentación
const withSpecialProductPresentation = (WrappedComponent: React.ComponentType<any>) => {
  return function WithSpecialProductPresentation(props: SpecialProps) {
    const { selected, disabled, purchased } = props.product;
    
    const getStatusIcon = () => {
      if (disabled || purchased || props.disabled) {
        return null;
      }
      if (selected) {
        return <Check className="w-4 h-4 text-primary"/>;
      }
      return <Plus className="w-4 h-4" />;
    };

    return <WrappedComponent {...props} getStatusIcon={getStatusIcon} />;
  };
};

interface ProductTitleProps {
  product: ProductsPass;
  selected: boolean;
  disabled: boolean;
}

const ProductTitle = ({ product, selected, disabled }: ProductTitleProps) => (
  <span className={cn(
    "font-semibold flex items-center gap-2",
    selected && "text-primary",
    disabled && "text-muted-foreground/50"
  )}>
    <Crown className={cn("w-5 h-5 text-orange-500", disabled && "text-muted-foreground/50")} />
    {product.name}
    {
      !disabled && (
        <TooltipPatreon purchased={product.purchased}/>
      )
    }
  </span>
);

interface ProductPriceProps {
  product: ProductsPass;
  selected: boolean;
  disabled: boolean;
}

const ProductPrice = ({ product, selected, disabled }: ProductPriceProps) => (
  <span className={cn(
    "font-medium",
    selected && "text-primary",
    disabled && "text-muted-foreground/50"
  )}>
    ${product.price.toLocaleString()}
  </span>
);

const TooltipPatreon = ({ purchased }: { purchased?: boolean }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="cursor-pointer">
        <Info className={cn("w-4 h-4 text-muted-foreground", purchased && "text-foreground")} />
      </div>
    </TooltipTrigger>
    <TooltipContent className="bg-card text-card-foreground max-w-[420px] border border-border">
      ⁠A patron pass gives you access to the whole month and supports scholarships 
      for researchers, artists and young builders. Edge Institute is a certified 
      501c3 and you will receive a written acknowledgement from us for your records.
    </TooltipContent>
  </Tooltip>
);

// Interfaces
interface SpecialProps {
  product: ProductsPass;
  onClick?: () => void;
  disabled?: boolean;
}

type VariantStyles = 'selected' | 'purchased' | 'edit' | 'disabled' | 'default'

const variants: Record<VariantStyles, string> = {
  selected: 'bg-gradient-to-r from-[#FF7B7B]/30 to-[#E040FB]/30 border-primary',
  purchased: 'bg-background text-foreground border-border cursor-not-allowed',
  edit: 'bg-secondary/30 border-dashed border-border text-card-foreground',
  disabled: 'bg-muted/50 text-muted-foreground cursor-not-allowed',
  default: 'bg-card border-border text-card-foreground hover:bg-gradient-to-r hover:from-[#FF7B7B]/10 hover:to-[#E040FB]/10',
}

// Componente base
function SpecialBase({ 
  product, 
  onClick,
  getStatusIcon,
  disabled
}: SpecialProps & { getStatusIcon: () => JSX.Element, disabled: boolean }) {

  const { selected, disabled: productDisabled, purchased } = product
  const soldOut = isSoldOut(product)

  const isDisabled = disabled || productDisabled || soldOut
  const hasOnClick = !isDisabled && onClick && !purchased
  return (
    <button
      data-category="patreon"
      onClick={hasOnClick ? onClick : undefined}
      data-selected={selected}
      data-price={product.price}
      className={cn(
        'w-full py-1 px-4 flex items-center justify-between gap-2 border rounded-md',
        variants[purchased ? 'purchased' : isDisabled || !onClick ? 'disabled' : selected ? 'selected' : 'default']
      )}
    >
      <div className="flex items-center gap-2 py-2">
        {getStatusIcon()}
        <ProductTitle product={product} disabled={isDisabled || !onClick} selected={selected ?? false} />
      </div>
      
      <div className="flex items-center gap-4">
        {
          product.purchased ? (
            <span className="text-sm font-medium text-foreground">
              Purchased
            </span>
          ) : soldOut ? (
            <span className="text-sm font-medium text-destructive/70">Sold Out</span>
          ) : (
            <ProductPrice product={product} selected={selected ?? false} disabled={isDisabled || !onClick} />
          )
        }
      </div>
    </button>
  );
}

// Exportar el componente envuelto con el HOC
export default withSpecialProductPresentation(SpecialBase);
