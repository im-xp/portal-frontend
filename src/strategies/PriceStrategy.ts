import { DiscountProps } from "@/types/discounts";
import { ProductsPass } from "@/types/Products";

export interface PriceStrategy {
  calculatePrice(product: ProductsPass, hasPatreonPurchased: boolean, discount: number, appliesTo?: string): number;
  getBestDiscount(price: number, applicationDiscount: number, currentDiscount: DiscountProps): DiscountProps;
}

class DefaultPriceStrategy implements PriceStrategy {
  calculatePrice(product: ProductsPass, hasPatreonPurchased: boolean, discount: number, appliesTo?: string): number {
    const isSpecialProduct = product.category === 'patreon' || product.category === 'supporter';
    const originalPrice = product.original_price || product.price || 0;

    if (!isSpecialProduct && hasPatreonPurchased) {
      return 0;
    }

    const isDiscountExcluded =
      product.category === 'patreon' ||
      product.category === 'supporter' ||
      product.slug === 'portal-patron' ||
      (product.category === 'lodging' && appliesTo !== 'lodging' && appliesTo !== 'all');

    if (!isDiscountExcluded && discount > 0) {
      return originalPrice * (1 - discount / 100) * (product.quantity || 1);
    }

    return originalPrice;
  }

  getBestDiscount(price: number, applicationDiscount: number, currentDiscount: DiscountProps): DiscountProps {
    if (currentDiscount.discount_type === 'percentage') {
      return currentDiscount.discount_value > applicationDiscount
        ? currentDiscount
        : { discount_value: applicationDiscount, discount_type: 'percentage' };
    }

    const fixedDiscountPercentage = (currentDiscount.discount_value / price) * 100;
    return fixedDiscountPercentage > applicationDiscount
      ? currentDiscount
      : { discount_value: applicationDiscount, discount_type: 'percentage' };
  }
}

export const getPriceStrategy = (): PriceStrategy => {
  return new DefaultPriceStrategy();
}; 