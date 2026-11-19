import { SEED_ORDERS, SEED_QUOTES } from '../data/riceCatalog';
import type { CartItem, OrderRecord, QuoteRecord } from '../types/rice';

const CART_KEY = 'gaophusa_cart_v1';
const ORDERS_KEY = 'gaophusa_orders_v1';
const QUOTES_KEY = 'gaophusa_quotes_v1';

export function loadCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadOrders(): OrderRecord[] {
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return SEED_ORDERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_ORDERS;
  } catch {
    return SEED_ORDERS;
  }
}

export function saveOrders(orders: OrderRecord[]): void {
  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadQuotes(): QuoteRecord[] {
  try {
    const raw = window.localStorage.getItem(QUOTES_KEY);
    if (!raw) return SEED_QUOTES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_QUOTES;
  } catch {
    return SEED_QUOTES;
  }
}

export function saveQuotes(quotes: QuoteRecord[]): void {
  try {
    window.localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  } catch {
    // Ignore storage quota errors
  }
}
