import test from 'node:test';
import assert from 'node:assert/strict';
import { RICE_PRODUCTS } from '../data/riceCatalog';
import {
  calculateCartSummary,
  calculateLinePricing,
  filterAndSortProducts,
  isValidVietnamesePhone,
  normalizeVietnamese,
  validateCheckoutForm,
  validateQuoteForm,
} from './pricing';

const st25 = RICE_PRODUCTS.find((p) => p.id === 'st25-soc-trang')!;
const gao504 = RICE_PRODUCTS.find((p) => p.id === 'gao-504-cu-tien-giang')!;

test('calculateLinePricing applies retail vs 3 wholesale tiers accurately', () => {
  const retail = calculateLinePricing(st25, 49);
  assert.equal(retail.tierCode, 'retail');
  assert.equal(retail.unitPricePerKg, 36000);
  assert.equal(retail.savings, 0);
  assert.equal(retail.nextTierKg, 50);

  const tier50 = calculateLinePricing(st25, 50);
  assert.equal(tier50.tierCode, 'tier_50');
  assert.equal(tier50.unitPricePerKg, 31500);
  assert.equal(tier50.subtotal, 50 * 31500);
  assert.equal(tier50.savings, 50 * (36000 - 31500));

  const tier500 = calculateLinePricing(st25, 600);
  assert.equal(tier500.tierCode, 'tier_500');
  assert.equal(tier500.unitPricePerKg, 29800);
  assert.equal(tier500.nextTierKg, 2000);

  const tier2000 = calculateLinePricing(st25, 2500);
  assert.equal(tier2000.tierCode, 'tier_2000');
  assert.equal(tier2000.unitPricePerKg, 28200);
  assert.equal(tier2000.nextTierKg, null);
});

test('calculateCartSummary aggregates weight per product to unlock wholesale tier and free shipping', () => {
  // 2 bags of 25kg ST25 = 50kg total -> unlocks tier_50 wholesale pricing + free shipping
  const summary = calculateCartSummary(
    [
      { productId: 'st25-soc-trang', packWeightKg: 25, quantity: 2 },
    ],
    RICE_PRODUCTS
  );

  assert.equal(summary.totalKg, 50);
  assert.equal(summary.isWholesaleOrder, true);
  assert.equal(summary.lines[0].appliedTierCode, 'tier_50');
  assert.equal(summary.subtotal, 50 * 31500);
  assert.equal(summary.totalSavings, 50 * (36000 - 31500));
  assert.equal(summary.shippingFee, 0);
  assert.equal(summary.grandTotal, 50 * 31500);
});

test('calculateCartSummary applies retail shipping fee below 300,000 VND and waives it at or above', () => {
  const smallRetail = calculateCartSummary(
    [{ productId: 'nang-hoa-9', packWeightKg: 5, quantity: 1 }],
    RICE_PRODUCTS
  );
  assert.equal(smallRetail.subtotal, 5 * 26000);
  assert.equal(smallRetail.isFreeShipping, false);
  assert.equal(smallRetail.shippingFee, 25000);
  assert.equal(smallRetail.grandTotal, 155000);

  const freeRetail = calculateCartSummary(
    [{ productId: 'st25-soc-trang', packWeightKg: 10, quantity: 1 }],
    RICE_PRODUCTS
  );
  assert.equal(freeRetail.subtotal, 360000);
  assert.equal(freeRetail.isFreeShipping, true);
  assert.equal(freeRetail.shippingFee, 0);
});

test('filterAndSortProducts supports Vietnamese diacritic-insensitive search and sorting', () => {
  assert.equal(normalizeVietnamese('Gạo Nếp Cái Hoa Vàng'), 'gao nep cai hoa vang');

  const searchRes = filterAndSortProducts(RICE_PRODUCTS, {
    category: 'all',
    searchQuery: 'soc trang',
    sortBy: 'popular',
    mode: 'retail',
  });
  assert.equal(searchRes.length, 1);
  assert.equal(searchRes[0].id, 'st25-soc-trang');

  const sortedWholesale = filterAndSortProducts(RICE_PRODUCTS, {
    category: 'all',
    searchQuery: '',
    sortBy: 'price-asc',
    mode: 'wholesale',
  });
  assert.equal(sortedWholesale[0].id, gao504.id);
});

test('phone, checkout, and quote validation catch invalid inputs and enforce VAT fields', () => {
  assert.equal(isValidVietnamesePhone('0908 123 456'), true);
  assert.equal(isValidVietnamesePhone('12345'), false);

  const emptyCheckoutErrors = validateCheckoutForm({
    customerName: '',
    phone: '0123',
    address: 'Q1',
    note: '',
    paymentMethod: 'cod',
    needVatInvoice: true,
    companyName: '',
    taxCode: 'abc',
  });
  assert.ok(emptyCheckoutErrors.customerName);
  assert.ok(emptyCheckoutErrors.phone);
  assert.ok(emptyCheckoutErrors.address);
  assert.ok(emptyCheckoutErrors.companyName);
  assert.ok(emptyCheckoutErrors.taxCode);

  const validCheckoutErrors = validateCheckoutForm({
    customerName: 'Nguyễn Văn An',
    phone: '0909123456',
    address: '125 Lý Tự Trọng, Quận 1, TP.HCM',
    note: '',
    paymentMethod: 'cod',
    needVatInvoice: true,
    companyName: 'Công ty TNHH Thực Phẩm An Phát',
    taxCode: '0312345678',
  });
  assert.deepEqual(validCheckoutErrors, {});

  const badQuote = validateQuoteForm({
    contactName: '',
    phone: '',
    businessType: 'Đại lý / Cửa hàng gạo',
    productId: 'st25-soc-trang',
    quantityKg: 20,
    deliveryArea: '',
    needSample: true,
    needVat: false,
    note: '',
  });
  assert.ok(badQuote.contactName);
  assert.ok(badQuote.phone);
  assert.ok(badQuote.quantityKg);
  assert.ok(badQuote.deliveryArea);
});
