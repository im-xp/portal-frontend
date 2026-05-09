import assert from 'node:assert/strict';

import { TotalCalculator } from '../src/strategies/TotalStrategy';
import type { AttendeeProps } from '../src/types/Attendee';
import type { ProductsPass } from '../src/types/Products';

function product(overrides: Partial<ProductsPass>): ProductsPass {
  return {
    id: 0,
    name: 'Test Product',
    slug: 'test-product',
    price: 0,
    popup_city_id: 1,
    description: null,
    category: 'month',
    start_date: null,
    end_date: null,
    is_active: true,
    created_at: null,
    updated_at: null,
    attendee_category: 'main',
    builder_price: null,
    compare_price: null,
    exclusive: false,
    max_inventory: null,
    current_sold: 0,
    quantity: 1,
    ...overrides,
  };
}

const attendees = [
  {
    id: 297,
    name: 'Nike Alade',
    category: 'main',
    products: [
      product({
        id: 25,
        name: 'Bed (Bunk) in 4 person dorm',
        slug: '4-person-bunk',
        category: 'lodging',
        price: 1200,
        original_price: 1200,
        purchased: true,
        selected: false,
      }),
      product({
        id: 22,
        name: 'Portal Entry Pass',
        slug: 'portal-entry-pass',
        category: 'month',
        price: 1279,
        original_price: 3000,
        purchased: false,
        selected: true,
      }),
    ],
  },
] as AttendeeProps[];

const result = new TotalCalculator().calculate(attendees, {
  discount_value: 57.366666666,
  discount_type: 'percentage',
  discount_code: 'PASS1721',
  city_id: 1,
  applies_to: 'pass',
});

assert.equal(result.total, 1279);
assert.equal(result.discountAmount, 1720.99999998);

console.log('TotalStrategy PASS1721 lodging regression: ok');
