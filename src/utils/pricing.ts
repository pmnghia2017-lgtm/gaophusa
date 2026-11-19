import type {
  CartItem,
  CartLineDetail,
  CartSummary,
  CheckoutFormInput,
  PricingTierResult,
  PurchaseMode,
  QuoteFormInput,
  RiceCategory,
  RiceProduct,
  SortOption,
  TierCode,
  ValidationErrors,
} from '../types/rice';

export const WHOLESALE_MIN_KG = 50;
export const WHOLESALE_TIER2_KG = 500;
export const WHOLESALE_TIER3_KG = 2000;
export const RETAIL_FREE_SHIPPING_THRESHOLD = 300000;
export const STANDARD_RETAIL_SHIPPING_FEE = 25000;

export function formatVnd(amount: number): string {
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString('vi-VN')} đ`;
}

export function normalizeVietnamese(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

export function calculateLinePricing(
  product: RiceProduct,
  totalKg: number
): PricingTierResult {
  const safeKg = Math.max(0, Math.floor(totalKg));
  let tierCode: TierCode = 'retail';
  let tierLabel = 'Giá lẻ';
  let unitPricePerKg = product.retailPricePerKg;
  let nextTierKg: number | null = WHOLESALE_MIN_KG;
  let nextTierUnitPrice: number | null = product.wholesale.tier50Kg;

  if (safeKg >= WHOLESALE_TIER3_KG) {
    tierCode = 'tier_2000';
    tierLabel = 'Giá sỉ từ 2 tấn';
    unitPricePerKg = product.wholesale.tier2000Kg;
    nextTierKg = null;
    nextTierUnitPrice = null;
  } else if (safeKg >= WHOLESALE_TIER2_KG) {
    tierCode = 'tier_500';
    tierLabel = 'Giá sỉ 500kg – 1,9 tấn';
    unitPricePerKg = product.wholesale.tier500Kg;
    nextTierKg = WHOLESALE_TIER3_KG;
    nextTierUnitPrice = product.wholesale.tier2000Kg;
  } else if (safeKg >= WHOLESALE_MIN_KG) {
    tierCode = 'tier_50';
    tierLabel = 'Giá sỉ 50–499kg';
    unitPricePerKg = product.wholesale.tier50Kg;
    nextTierKg = WHOLESALE_TIER2_KG;
    nextTierUnitPrice = product.wholesale.tier500Kg;
  }

  const subtotal = safeKg * unitPricePerKg;
  const retailEquivalent = safeKg * product.retailPricePerKg;
  const savings = Math.max(0, retailEquivalent - subtotal);

  return {
    tierCode,
    tierLabel,
    unitPricePerKg,
    retailUnitPricePerKg: product.retailPricePerKg,
    totalKg: safeKg,
    subtotal,
    retailEquivalent,
    savings,
    nextTierKg,
    nextTierUnitPrice,
  };
}

export function calculateCartSummary(
  items: CartItem[],
  products: RiceProduct[]
): CartSummary {
  const productMap = new Map(products.map((p) => [p.id, p]));

  // Aggregate total weight per product so buying multiple bags of the same rice unlocks wholesale tiers
  const kgByProduct = new Map<string, number>();
  for (const item of items) {
    if (item.quantity <= 0) continue;
    const prev = kgByProduct.get(item.productId) ?? 0;
    kgByProduct.set(item.productId, prev + item.packWeightKg * item.quantity);
  }

  const lines: CartLineDetail[] = [];
  let totalPacks = 0;
  let totalKg = 0;
  let subtotal = 0;
  let retailSubtotal = 0;
  let totalSavings = 0;

  for (const item of items) {
    if (item.quantity <= 0) continue;
    const product = productMap.get(item.productId);
    if (!product) continue;

    const lineKg = item.packWeightKg * item.quantity;
    const combinedProductKg = kgByProduct.get(item.productId) ?? lineKg;
    const pricing = calculateLinePricing(product, combinedProductKg);
    const lineSubtotal = lineKg * pricing.unitPricePerKg;
    const lineRetail = lineKg * product.retailPricePerKg;
    const lineSavings = Math.max(0, lineRetail - lineSubtotal);

    lines.push({
      item,
      product,
      lineKg,
      combinedProductKg,
      appliedUnitPricePerKg: pricing.unitPricePerKg,
      appliedTierLabel: pricing.tierLabel,
      appliedTierCode: pricing.tierCode,
      lineSubtotal,
      lineSavings,
    });

    totalPacks += item.quantity;
    totalKg += lineKg;
    subtotal += lineSubtotal;
    retailSubtotal += lineRetail;
    totalSavings += lineSavings;
  }

  const isWholesaleOrder = totalKg >= WHOLESALE_MIN_KG;
  let shippingFee = 0;
  let isFreeShipping = true;
  let freeShippingReason = '';

  if (totalPacks === 0) {
    shippingFee = 0;
    isFreeShipping = true;
    freeShippingReason = '';
  } else if (isWholesaleOrder) {
    shippingFee = 0;
    isFreeShipping = true;
    freeShippingReason = 'Miễn phí xe tải nội thành & bốc xếp cho đơn sỉ từ 50kg';
  } else if (subtotal >= RETAIL_FREE_SHIPPING_THRESHOLD) {
    shippingFee = 0;
    isFreeShipping = true;
    freeShippingReason = 'Miễn phí giao hàng cho đơn lẻ từ 300.000 đ';
  } else {
    shippingFee = STANDARD_RETAIL_SHIPPING_FEE;
    isFreeShipping = false;
    const remaining = RETAIL_FREE_SHIPPING_THRESHOLD - subtotal;
    freeShippingReason = `Mua thêm ${formatVnd(remaining)} để được miễn phí giao hàng`;
  }

  return {
    lines,
    totalPacks,
    totalKg,
    subtotal,
    retailSubtotal,
    totalSavings,
    shippingFee,
    isFreeShipping,
    freeShippingReason,
    grandTotal: subtotal + shippingFee,
    isWholesaleOrder,
  };
}

export interface FilterOptions {
  category: RiceCategory;
  searchQuery: string;
  sortBy: SortOption;
  mode: PurchaseMode;
}

export function filterAndSortProducts(
  products: RiceProduct[],
  options: FilterOptions
): RiceProduct[] {
  const query = normalizeVietnamese(options.searchQuery);

  const filtered = products.filter((product) => {
    if (options.category !== 'all' && product.category !== options.category) {
      return false;
    }
    if (!query) return true;

    const haystack = normalizeVietnamese(
      `${product.name} ${product.origin} ${product.categoryLabel} ${product.shortNote} ${product.suitableFor} ${product.sku}`
    );
    return haystack.includes(query);
  });

  const priceOf = (p: RiceProduct) =>
    options.mode === 'wholesale' ? p.wholesale.tier50Kg : p.retailPricePerKg;

  return [...filtered].sort((a, b) => {
    if (options.sortBy === 'price-asc') {
      return priceOf(a) - priceOf(b);
    }
    if (options.sortBy === 'price-desc') {
      return priceOf(b) - priceOf(a);
    }
    return a.featuredRank - b.featuredRank;
  });
}

export function isValidVietnamesePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s.-]/g, '');
  return /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(cleaned);
}

export function validateCheckoutForm(input: CheckoutFormInput): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!input.customerName.trim() || input.customerName.trim().length < 2) {
    errors.customerName = 'Vui lòng nhập họ tên người nhận hoặc tên cửa hàng.';
  }

  if (!input.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại liên hệ.';
  } else if (!isValidVietnamesePhone(input.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ (gồm 10 chữ số, ví dụ 0908 123 456).';
  }

  if (!input.address.trim() || input.address.trim().length < 8) {
    errors.address = 'Vui lòng nhập địa chỉ giao hàng cụ thể (số nhà, đường, quận/huyện).';
  }

  if (input.needVatInvoice) {
    if (!input.companyName.trim()) {
      errors.companyName = 'Vui lòng nhập tên công ty / hộ kinh doanh xuất hóa đơn.';
    }
    if (!input.taxCode.trim() || !/^\d{10}(-\d{3})?$/.test(input.taxCode.trim())) {
      errors.taxCode = 'Mã số thuế gồm 10 chữ số (hoặc 10-3 chữ số chi nhánh).';
    }
  }

  return errors;
}

export function validateQuoteForm(input: QuoteFormInput): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!input.contactName.trim() || input.contactName.trim().length < 2) {
    errors.contactName = 'Vui lòng nhập tên người liên hệ hoặc đơn vị.';
  }

  if (!input.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại nhận báo giá.';
  } else if (!isValidVietnamesePhone(input.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ (ví dụ: 0912 345 678).';
  }

  if (!Number.isFinite(input.quantityKg) || input.quantityKg < WHOLESALE_MIN_KG) {
    errors.quantityKg = `Sản lượng báo giá sỉ tối thiểu từ ${WHOLESALE_MIN_KG} kg.`;
  }

  if (!input.deliveryArea.trim() || input.deliveryArea.trim().length < 3) {
    errors.deliveryArea = 'Vui lòng nhập khu vực nhận hàng hoặc chành xe.';
  }

  return errors;
}

export function generateOrderCode(prefix: 'GPS' | 'BG'): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `${prefix}-${mm}${dd}${rand.slice(0, 2)}`;
}
