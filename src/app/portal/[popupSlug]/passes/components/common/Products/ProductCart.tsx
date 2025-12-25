
import { ProductsPass } from "@/types/Products"
import { badgeName } from "../../../constants/multiuse"

const ProductCart = ({ product }: { product: ProductsPass }) => {
  // For donations, use custom_price; otherwise use original_price or price
  const price = product.category === 'donation' 
    ? (product.custom_price ?? 0) 
    : (product.original_price ? product.original_price : product.price)
  
  const quantity = product.category.includes('day') ? (product.quantity ?? 0) - (product.original_quantity ?? 0) : 1

  const totalPrice = (price * quantity).toFixed(0)

  return (
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>{quantity} x {product.name} ({badgeName[product.attendee_category] || product.attendee_category})</span>
      <span data-product-price={totalPrice}>{product.edit ? `- $${totalPrice}` : `$${totalPrice}`}</span>
    </div>
  )
}
export default ProductCart