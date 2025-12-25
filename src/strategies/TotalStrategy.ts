import { AttendeeProps } from "@/types/Attendee";
import { DiscountProps } from "@/types/discounts";
import { ProductsPass } from "@/types/Products";

interface TotalResult {
  total: number;
  originalTotal: number;
  discountAmount: number;
}
interface PriceCalculationStrategy {
  calculate(products: ProductsPass[], discount: DiscountProps): TotalResult;
}

abstract class BasePriceStrategy implements PriceCalculationStrategy {
  protected calculateOriginalTotal(products: ProductsPass[]): number {
    return products.filter(p => p.selected).reduce((sum, product) => {
      const price = product.original_price ?? 0;
      
      if (product.purchased) {
        // Para productos comprados, solo contamos la diferencia adicional
        const diff = ((product.quantity || 1) - (product.original_quantity || 1));
        return diff > 0 ? sum + (price * diff) : sum;
      }
      
      // Para productos no comprados, contamos el precio total
      return sum + (price * (product.quantity || 1));
    }, 0);
  }

  // Calculate the total of products eligible for discounts
  // Excludes: patreon, supporter, lodging, and portal-patron
  protected calculateDiscountableTotal(products: ProductsPass[]): number {
    return products
      .filter(p => p.selected && !p.purchased)
      .filter(p => 
        p.category !== 'patreon' && 
        p.category !== 'supporter' && 
        p.category !== 'lodging' &&
        p.slug !== 'portal-patron'
      )
      .reduce((sum, product) => {
        const price = product.original_price ?? product.price ?? 0;
        return sum + (price * (product.quantity || 1));
      }, 0);
  }

  abstract calculate(products: ProductsPass[], discount: DiscountProps): TotalResult;
}

class MonthlyPriceStrategy extends BasePriceStrategy {
  calculate(products: ProductsPass[], discount: DiscountProps): TotalResult {
    const hasPatreon = products.some(p => (p.category === 'patreon' || p.category === 'supporter') && p.selected);
    const monthProduct = products.find(p => (p.category === 'month' || p.category === 'local month') && p.selected && !p.purchased);
    const monthPrice = (monthProduct?.price ?? 0) * (monthProduct?.quantity ?? 1);
    
    // Calculate total of already purchased products (credit)
    const totalProductsPurchased = products
      .filter(p => p.category !== 'patreon' && p.category !== 'supporter')
      .reduce((sum, product) => sum + (product.purchased ? product.price * (product.quantity ?? 1) : 0), 0)
    
    // Calculate total of newly selected products (like lodging)
    const totalNewlySelected = products
      .filter(p => p.selected && !p.purchased && p.category !== 'month' && p.category !== 'local month' && p.category !== 'patreon' && p.category !== 'supporter')
      .reduce((sum, product) => sum + (product.price * (product.quantity ?? 1)), 0)

    const originalTotal = this.calculateOriginalTotal(products)
    // Discounts only apply to eligible products (not lodging or portal-patron)
    const discountableTotal = this.calculateDiscountableTotal(products)
    const discountAmount = discount.discount_value ? discountableTotal * (discount.discount_value / 100): 0;


    return {
      total: monthPrice + totalNewlySelected - (hasPatreon && monthProduct?.attendee_category !== 'main' ? 0 : totalProductsPurchased),
      originalTotal: originalTotal,
      discountAmount: discountAmount
    };
  }

  protected calculateOriginalTotal(products: ProductsPass[]): number {
    const monthPrice = products
      .find(p => p.selected && (p.category === 'month' || p.category === 'local month'))?.original_price ?? 0;
    
    // Include lodging and other newly selected products in original total
    const otherSelectedPrice = products
      .filter(p => p.selected && !p.purchased && p.category !== 'month' && p.category !== 'local month' && p.category !== 'patreon' && p.category !== 'supporter')
      .reduce((sum, product) => sum + ((product.original_price ?? product.price ?? 0) * (product.quantity ?? 1)), 0);
    
    return monthPrice + otherSelectedPrice;
  }
}

class WeeklyPriceStrategy extends BasePriceStrategy {
  calculate(products: ProductsPass[], discount: DiscountProps): TotalResult {
    // Include week, day, lodging, AND portal-patron products
    const selectedProducts = products.filter(p => 
      (p.category === 'week' || p.category === 'local week' || p.category.includes('day') || p.category === 'lodging' || p.slug === 'portal-patron') && p.selected
    );
    
    const totalSelected = selectedProducts.reduce((sum, product) => {
      if (product.purchased && !product.category.includes('day')) {
        return sum - ((product.price ?? 0) * (product.quantity || 1));
      }
      
      if (product.category.includes('day')) {
        if (product.purchased) {
          const diff = ((product.quantity || 1) - (product.original_quantity || 1));
          return diff > 0 ? sum + ((product.price ?? 0) * diff) : sum;
        } 
        return sum + ((product.price ?? 0) * (product.quantity || 1));
      }
      
      return sum + ((product.price ?? 0) * (product.quantity || 1));
    }, 0);
    
    const originalTotal = this.calculateOriginalTotal(products)
    // Discounts only apply to eligible products (not lodging or portal-patron)
    const discountableTotal = this.calculateDiscountableTotal(products)
    const discountAmount = discount.discount_value ? discountableTotal * (discount.discount_value / 100): 0;

    return {
      total: totalSelected,
      originalTotal: originalTotal,
      discountAmount: discountAmount
    };
  }
}

class PatreonPriceStrategy extends BasePriceStrategy {
  calculate(products: ProductsPass[], _discount: DiscountProps): TotalResult {
    const patreonProduct = products.find(p => (p.category === 'patreon' || p.category === 'supporter') && p.selected);
    const productsSelected = products.filter(p => p.selected && !p.purchased && p.category !== 'patreon' && p.category !== 'supporter')
    const patreonPrice = (patreonProduct?.price ?? 0) * (patreonProduct?.quantity ?? 1);
    const originalTotal = this.calculateOriginalTotal(products)
    const discountAmount = productsSelected.reduce((sum, product) => sum + ((product.original_price ?? 0) * (product.quantity ?? 1)), 0)

    return {
      total: patreonPrice,
      originalTotal: originalTotal,
      discountAmount: discountAmount
    };
  }
}

class MonthlyPurchasedPriceStrategy extends BasePriceStrategy {
  calculate(products: ProductsPass[], _discount: DiscountProps): TotalResult {
    const someSelectedWeek = products.some(p => p.selected && (p.category === 'week' || p.category === 'local week'))
    
    // Always include lodging in the total, even without week passes selected
    const lodgingTotal = products
      .filter(p => p.category === 'lodging' && p.selected && !p.purchased)
      .reduce((sum, product) => sum + (product.price * (product.quantity ?? 1)), 0)

    // Include Portal Patron (by slug) in the total
    const patronTotal = products
      .filter(p => p.slug === 'portal-patron' && p.selected && !p.purchased)
      .reduce((sum, product) => sum + (product.price * (product.quantity ?? 1)), 0)

    if(!someSelectedWeek) {
      // Even without week selected, lodging and patron should still be counted
      return {
        total: lodgingTotal + patronTotal,
        originalTotal: lodgingTotal + patronTotal,
        discountAmount: 0
      };
    }

    const monthProductPurchased = products.find(p => (p.category === 'month' || p.category === 'local month') && p.purchased);
    const weekProductsPurchased = products.filter(p => (p.category === 'week' || p.category === 'local week') && p.purchased && !p.selected)

    const totalWeekPurchased = weekProductsPurchased.reduce((sum, product) => sum + (product.price * (product.quantity ?? 1)), 0)

    const originalTotal = this.calculateOriginalTotal(products)
    
    return {
      total: totalWeekPurchased + lodgingTotal + patronTotal - ((monthProductPurchased?.price ?? 0) * (monthProductPurchased?.quantity ?? 1)),
      originalTotal: originalTotal,
      discountAmount: 0
    };
  }
}

class DayPriceStrategy extends BasePriceStrategy {
  calculate(products: ProductsPass[], discount: DiscountProps): TotalResult {
     const daySelectedProducts = products.filter(p => (p.category.includes('day')) && p.selected);
    
    const totalSelected = daySelectedProducts.reduce((sum, product) => {
      if (product.purchased) {
        return sum - ((product.price ?? 0) * (product.quantity ?? 1));
      }
      return sum + ((product.price ?? 0) * (product.quantity ?? 1));
    }, 0);
    
    const originalTotal = this.calculateOriginalTotal(products)
    // Discounts only apply to eligible products (not lodging or portal-patron)
    const discountableTotal = this.calculateDiscountableTotal(products)
    const discountAmount = discount.discount_value ? discountableTotal * (discount.discount_value / 100): 0;

    return {
      total: totalSelected,
      originalTotal: originalTotal,
      discountAmount: discountAmount
    };
  }
}


// Calculadora de totales
export class TotalCalculator {
  calculate(attendees: AttendeeProps[], discount: DiscountProps, groupDiscountPercentage?: number): TotalResult {
    const baseResult = attendees.reduce((total, attendee) => {
      const strategy = this.getStrategy(attendee.products);
      const result = strategy.calculate(attendee.products, discount);
      
      return {
        total: total.total + result.total,
        originalTotal: total.originalTotal + result.originalTotal,
        discountAmount: total.discountAmount + result.discountAmount
      };
    }, { total: 0, originalTotal: 0, discountAmount: 0 });

    // Calculate donation totals separately (donations use custom_price, not discountable)
    const donationTotal = attendees.reduce((total, attendee) => {
      return total + attendee.products
        .filter(p => p.category === 'donation' && p.selected && !p.purchased)
        .reduce((sum, p) => sum + (p.custom_price ?? 0), 0);
    }, 0);

    // Add donations to the totals
    const resultWithDonations = {
      total: baseResult.total + donationTotal,
      originalTotal: baseResult.originalTotal + donationTotal,
      discountAmount: baseResult.discountAmount
    };

    // Compare individual discount vs group discount and apply only the greater one
    if (groupDiscountPercentage && groupDiscountPercentage > 0) {
      // Donations should not be discounted, so only apply group discount to non-donation original total
      const nonDonationOriginal = baseResult.originalTotal;
      const groupDiscountAmount = nonDonationOriginal * (groupDiscountPercentage / 100);
      const individualDiscountAmount = baseResult.discountAmount;
      
      // Use the greater discount
      if (groupDiscountAmount > individualDiscountAmount) {
        return {
          total: nonDonationOriginal - groupDiscountAmount + donationTotal,
          originalTotal: resultWithDonations.originalTotal,
          discountAmount: groupDiscountAmount
        };
      }
    }

    return resultWithDonations;
  }

  private getStrategy(products: ProductsPass[]): PriceCalculationStrategy {
    const hasPatreon = products.some(p => (p.category === 'patreon' || p.category === 'supporter') && p.selected);
    const hasMonthly = products.some(p => (p.category === 'month' || p.category === 'local month') && p.selected);
    const hasMonthPurchased = products.some(p => (p.category === 'month' || p.category === 'local month') && p.purchased);

    if(hasPatreon) return new PatreonPriceStrategy()
    if(hasMonthly) return new MonthlyPriceStrategy()
    if(hasMonthPurchased) return new MonthlyPurchasedPriceStrategy()
    return new WeeklyPriceStrategy()
  }
}
