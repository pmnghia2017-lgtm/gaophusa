export type RiceCategory =
  | 'all'
  | 'dac-san'
  | 'deo-thom'
  | 'no-xop'
  | 'lut-nep';

export type PurchaseMode = 'retail' | 'wholesale';

export type PackWeightKg = 5 | 10 | 25 | 50;

export type SortOption = 'popular' | 'price-asc' | 'price-desc';

export type PaymentMethod = 'cod' | 'bank_transfer';

export interface WholesaleTiers {
  /** 50kg - 499kg (VND/kg) */
  tier50Kg: number;
  /** 500kg - 1,999kg (VND/kg) */
  tier500Kg: number;
  /** >= 2,000kg (VND/kg) */
  tier2000Kg: number;
}

export interface RiceCharacteristics {
  /** 1 (khô tơi) to 5 (rất dẻo) */
  stickiness: number;
  /** 1 (nở ít) to 5 (nở nhiều) */
  fluffiness: number;
  aroma: string;
  waterRatio: string;
  moistureMax: string;
  brokenRatio: string;
  harvestCrop: string;
}

export interface RiceProduct {
  id: string;
  sku: string;
  name: string;
  category: Exclude<RiceCategory, 'all'>;
  categoryLabel: string;
  origin: string;
  image: string;
  imageAlt: string;
  shortNote: string;
  description: string;
  suitableFor: string;
  retailPricePerKg: number;
  wholesale: WholesaleTiers;
  availablePacks: PackWeightKg[];
  characteristics: RiceCharacteristics;
  inStock: boolean;
  featuredRank: number;
  highlightTag?: string;
}

export interface CartItem {
  productId: string;
  packWeightKg: PackWeightKg;
  quantity: number;
}

export type TierCode = 'retail' | 'tier_50' | 'tier_500' | 'tier_2000';

export interface PricingTierResult {
  tierCode: TierCode;
  tierLabel: string;
  unitPricePerKg: number;
  retailUnitPricePerKg: number;
  totalKg: number;
  subtotal: number;
  retailEquivalent: number;
  savings: number;
  nextTierKg: number | null;
  nextTierUnitPrice: number | null;
}

export interface CartLineDetail {
  item: CartItem;
  product: RiceProduct;
  lineKg: number;
  combinedProductKg: number;
  appliedUnitPricePerKg: number;
  appliedTierLabel: string;
  appliedTierCode: TierCode;
  lineSubtotal: number;
  lineSavings: number;
}

export interface CartSummary {
  lines: CartLineDetail[];
  totalPacks: number;
  totalKg: number;
  subtotal: number;
  retailSubtotal: number;
  totalSavings: number;
  shippingFee: number;
  isFreeShipping: boolean;
  freeShippingReason: string;
  grandTotal: number;
  isWholesaleOrder: boolean;
}

export interface CheckoutFormInput {
  customerName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethod;
  needVatInvoice: boolean;
  companyName: string;
  taxCode: string;
}

export interface OrderRecord {
  orderCode: string;
  createdAt: string;
  status: string;
  customerName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethod;
  needVatInvoice: boolean;
  companyName?: string;
  taxCode?: string;
  isWholesaleOrder: boolean;
  totalKg: number;
  subtotal: number;
  shippingFee: number;
  totalSavings: number;
  grandTotal: number;
  items: Array<{
    productId: string;
    productName: string;
    packWeightKg: PackWeightKg;
    quantity: number;
    lineKg: number;
    unitPricePerKg: number;
    tierLabel: string;
    lineSubtotal: number;
  }>;
}

export interface QuoteFormInput {
  contactName: string;
  phone: string;
  businessType: string;
  productId: string;
  quantityKg: number;
  deliveryArea: string;
  needSample: boolean;
  needVat: boolean;
  note: string;
}

export interface QuoteRecord {
  quoteCode: string;
  createdAt: string;
  status: string;
  contactName: string;
  phone: string;
  businessType: string;
  productName: string;
  quantityKg: number;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  tierLabel: string;
  deliveryArea: string;
  needSample: boolean;
  needVat: boolean;
  note: string;
}

export interface ValidationErrors {
  [field: string]: string;
}
