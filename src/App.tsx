import { useEffect, useMemo, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { OriginAndOrdersSection } from './components/OriginAndOrdersSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WholesaleSection } from './components/WholesaleSection';
import { RICE_PRODUCTS } from './data/riceCatalog';
import type {
  CartItem,
  CheckoutFormInput,
  OrderRecord,
  PackWeightKg,
  PurchaseMode,
  QuoteFormInput,
  QuoteRecord,
  RiceCategory,
  RiceProduct,
  SortOption,
} from './types/rice';
import {
  calculateCartSummary,
  calculateLinePricing,
  filterAndSortProducts,
  generateOrderCode,
} from './utils/pricing';
import {
  loadCart,
  loadOrders,
  loadQuotes,
  saveCart,
  saveOrders,
  saveQuotes,
} from './utils/storage';

export default function App() {
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('retail');
  const [category, setCategory] = useState<RiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCart());
  const [orders, setOrders] = useState<OrderRecord[]>(() => loadOrders());
  const [quotes, setQuotes] = useState<QuoteRecord[]>(() => loadQuotes());

  const [selectedProduct, setSelectedProduct] = useState<RiceProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveQuotes(quotes);
  }, [quotes]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(RICE_PRODUCTS, {
        category,
        searchQuery,
        sortBy,
        mode: purchaseMode,
      }),
    [category, searchQuery, sortBy, purchaseMode]
  );

  const cartSummary = useMemo(
    () => calculateCartSummary(cartItems, RICE_PRODUCTS),
    [cartItems]
  );

  const handleAddToCart = (
    product: RiceProduct,
    packWeightKg: PackWeightKg,
    quantity: number
  ) => {
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.productId === product.id && item.packWeightKg === packWeightKg
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { productId: product.id, packWeightKg, quantity }];
    });

    const addedKg = packWeightKg * quantity;
    setToastMessage(`Đã thêm ${addedKg.toLocaleString('vi-VN')}kg ${product.name} vào giỏ hàng`);
  };

  const handleUpdateQuantity = (
    productId: string,
    packWeightKg: PackWeightKg,
    delta: number
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.packWeightKg === packWeightKg
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string, packWeightKg: PackWeightKg) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.packWeightKg === packWeightKg)
      )
    );
  };

  const handlePlaceOrder = (input: CheckoutFormInput): OrderRecord => {
    const newOrder: OrderRecord = {
      orderCode: generateOrderCode('GPS'),
      createdAt: new Date().toISOString(),
      status: 'Đã xác nhận — Đang chuẩn bị xuất kho',
      customerName: input.customerName.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
      note: input.note.trim(),
      paymentMethod: input.paymentMethod,
      needVatInvoice: input.needVatInvoice,
      companyName: input.needVatInvoice ? input.companyName.trim() : undefined,
      taxCode: input.needVatInvoice ? input.taxCode.trim() : undefined,
      isWholesaleOrder: cartSummary.isWholesaleOrder,
      totalKg: cartSummary.totalKg,
      subtotal: cartSummary.subtotal,
      shippingFee: cartSummary.shippingFee,
      totalSavings: cartSummary.totalSavings,
      grandTotal: cartSummary.grandTotal,
      items: cartSummary.lines.map((line) => ({
        productId: line.product.id,
        productName: line.product.name,
        packWeightKg: line.item.packWeightKg,
        quantity: line.item.quantity,
        lineKg: line.lineKg,
        unitPricePerKg: line.appliedUnitPricePerKg,
        tierLabel: line.appliedTierLabel,
        lineSubtotal: line.lineSubtotal,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    return newOrder;
  };

  const handleSubmitQuote = (
    input: QuoteFormInput,
    product: RiceProduct
  ): QuoteRecord => {
    const pricing = calculateLinePricing(product, input.quantityKg);
    const newQuote: QuoteRecord = {
      quoteCode: generateOrderCode('BG'),
      createdAt: new Date().toISOString(),
      status: 'Đã tiếp nhận — Đang lập báo giá chi tiết',
      contactName: input.contactName.trim(),
      phone: input.phone.trim(),
      businessType: input.businessType,
      productName: product.name,
      quantityKg: input.quantityKg,
      estimatedUnitPrice: pricing.unitPricePerKg,
      estimatedTotal: pricing.subtotal,
      tierLabel: pricing.tierLabel,
      deliveryArea: input.deliveryArea.trim(),
      needSample: input.needSample,
      needVat: input.needVat,
      note: input.note.trim(),
    };

    setQuotes((prev) => [newQuote, ...prev]);
    return newQuote;
  };

  const handleJumpToWholesale = () => {
    setPurchaseMode('wholesale');
    const el = document.getElementById('bang-gia-si');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#12261B]">
      <Header
        cartCount={cartSummary.totalPacks}
        cartKg={cartSummary.totalKg}
        onOpenCart={() => setCartOpen(true)}
      />

      <main>
        <HeroSection onSelectWholesaleMode={handleJumpToWholesale} />

        <CatalogSection
          products={filteredProducts}
          mode={purchaseMode}
          category={category}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onModeChange={setPurchaseMode}
          onCategoryChange={setCategory}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onResetFilters={() => {
            setCategory('all');
            setSearchQuery('');
            setSortBy('popular');
          }}
          onSelectProduct={setSelectedProduct}
          onQuickAdd={handleAddToCart}
        />

        <WholesaleSection
          products={RICE_PRODUCTS}
          onQuickAddWholesale={(product, packWeight, qty) => {
            handleAddToCart(product, packWeight, qty);
            setCartOpen(true);
          }}
          onSubmitQuote={handleSubmitQuote}
        />

        <OriginAndOrdersSection orders={orders} quotes={quotes} />
      </main>

      <Footer />

      <ProductDetailModal
        product={selectedProduct}
        initialMode={purchaseMode}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        open={cartOpen}
        summary={cartSummary}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Live Feedback Toast (non-blocking, concise) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 bottom-4 z-40 flex items-center gap-4 rounded-md border border-[#F7CA5E]/40 bg-[#123D27] px-4 py-3 text-sm text-white shadow-lg"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setCartOpen(true);
            }}
            className="font-semibold text-[#F7CA5E] underline underline-offset-2 hover:text-white whitespace-nowrap shrink-0"
          >
            Xem giỏ
          </button>
        </div>
      )}
    </div>
  );
}
