import { ProductsProps } from "@/types/Products";

/**
 * Check if a product is sold out based on inventory
 * Returns false if max_inventory is null/undefined (unlimited inventory)
 */
export const isSoldOut = (product: ProductsProps): boolean => {
  if (product.max_inventory === null || product.max_inventory === undefined) {
    return false;
  }
  return (product.current_sold ?? 0) >= product.max_inventory;
};

/**
 * Get the number of available units for a product
 * Returns null if inventory is unlimited
 */
export const getAvailableCount = (product: ProductsProps): number | null => {
  if (product.max_inventory === null || product.max_inventory === undefined) {
    return null;
  }
  return Math.max(0, product.max_inventory - (product.current_sold ?? 0));
};
