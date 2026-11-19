import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { PackWeightKg, PurchaseMode, RiceProduct } from '../types/rice';
import { calculateLinePricing, formatVnd } from '../utils/pricing';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: RiceProduct | null;
  initialMode: PurchaseMode;
  onClose: () => void;
  onAddToCart: (product: RiceProduct, packWeightKg: PackWeightKg, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  initialMode,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [selectedPack, setSelectedPack] = useState<PackWeightKg>(5);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!product) return;
    const defaultPack: PackWeightKg =
      initialMode === 'wholesale'
        ? product.availablePacks.includes(50)
          ? 50
          : 25
        : product.availablePacks.includes(5)
          ? 5
          : 10;
    setSelectedPack(defaultPack);
    setQuantity(initialMode === 'wholesale' && defaultPack === 25 ? 2 : 1);
  }, [product, initialMode]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const totalKg = selectedPack * quantity;
  const pricing = calculateLinePricing(product, totalKg);

  const handleConfirmAdd = () => {
    onAddToCart(product, selectedPack, quantity);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-[#DCD9CF] bg-[#FAFAF8] shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng chi tiết sản phẩm"
          className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#DCD9CF] bg-white text-[#171A17] transition-colors hover:bg-[#F2F1EC]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Product Photography & Grain Spec Sheet */}
          <div className="border-b border-[#E5E3DC] bg-white p-6 lg:col-span-6 lg:border-r lg:border-b-0">
            <div className="aspect-[4/3] overflow-hidden rounded-md bg-[#F2F1EC]">
              <ResilientImage
                src={product.image}
                alt={product.imageAlt}
                fallbackLabel={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[#171A17]">
                Thông số chất lượng & hướng dẫn nấu
              </h4>
              <dl className="mt-3 divide-y divide-[#ECEAE3] border-y border-[#ECEAE3] text-xs">
                <div className="flex justify-between py-2.5">
                  <dt className="text-[#565B52]">Hương thơm</dt>
                  <dd className="font-medium text-[#171A17]">
                    {product.characteristics.aroma}
                  </dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-[#565B52]">Độ dẻo / Độ nở</dt>
                  <dd className="font-mono font-medium text-[#171A17] tabular-nums">
                    Dẻo {product.characteristics.stickiness}/5 · Nở{' '}
                    {product.characteristics.fluffiness}/5
                  </dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-[#565B52]">Tỷ lệ nước nấu khuyến nghị</dt>
                  <dd className="font-medium text-[#171A17]">
                    {product.characteristics.waterRatio}
                  </dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-[#565B52]">Độ ẩm / Tỷ lệ tấm</dt>
                  <dd className="font-mono font-medium text-[#171A17] tabular-nums">
                    {product.characteristics.moistureMax} · Tấm{' '}
                    {product.characteristics.brokenRatio}
                  </dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-[#565B52]">Phù hợp cho</dt>
                  <dd className="max-w-[60%] text-right font-medium text-[#171A17]">
                    {product.suitableFor}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="flex flex-col justify-between p-6 lg:col-span-6 lg:p-7">
            <div>
              <p className="pr-10 text-xs font-medium text-[#565B52]">
                {product.categoryLabel} · {product.origin} · Mã {product.sku}
              </p>

              <h3
                id="pdp-title"
                className="mt-2 pr-8 font-display text-2xl font-semibold leading-snug text-[#171A17]"
              >
                {product.name}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#474C44]">
                {product.description}
              </p>

              {/* Live Price & Active Tier Display */}
              <div className="mt-5 rounded-lg border border-[#CBE0D2] bg-[#EEF6F1] p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-[#155E37]">
                      {pricing.tierLabel}
                    </p>
                    <p className="mt-0.5 text-2xl font-bold text-[#12261B] tabular-nums">
                      {formatVnd(pricing.unitPricePerKg)}
                      <span className="text-xs font-normal text-[#4B5A50]">/kg</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#4B5A50]">Tổng khối lượng</p>
                    <p className="mt-0.5 text-base font-bold text-[#155E37] tabular-nums">
                      {totalKg.toLocaleString('vi-VN')} kg
                    </p>
                  </div>
                </div>

                {/* Wholesale tier ladder reference */}
                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#D2E3D8] pt-3 text-xs">
                  <div>
                    <div className="text-[#4B5A50]">50–499kg</div>
                    <div className="mt-0.5 font-semibold text-[#12261B] tabular-nums">
                      {formatVnd(product.wholesale.tier50Kg)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#4B5A50]">500kg–1,9 tấn</div>
                    <div className="mt-0.5 font-semibold text-[#12261B] tabular-nums">
                      {formatVnd(product.wholesale.tier500Kg)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#9A6306]">Từ 2 tấn</div>
                    <div className="mt-0.5 font-bold text-[#8F5A05] tabular-nums">
                      {formatVnd(product.wholesale.tier2000Kg)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pack Size Selector */}
              <div className="mt-5">
                <span className="block text-sm font-medium text-[#171A17]">
                  Chọn quy cách đóng gói
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {product.availablePacks.map((pack) => {
                    const active = selectedPack === pack;
                    return (
                      <button
                        key={pack}
                        type="button"
                        onClick={() => setSelectedPack(pack)}
                        aria-pressed={active}
                        className={`min-h-[42px] rounded-md border px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                          active
                            ? 'border-[#1E4D2B] bg-[#1E4D2B] text-white'
                            : 'border-[#DCD9CF] bg-white text-[#171A17] hover:border-[#1E4D2B]'
                        }`}
                      >
                        {pack >= 25 ? `Bao ${pack}kg` : `Túi ${pack}kg`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-sm font-medium text-[#171A17]">
                    Số lượng ({selectedPack >= 25 ? 'bao' : 'túi'})
                  </span>
                  {pricing.nextTierKg && pricing.nextTierUnitPrice && (
                    <p className="mt-0.5 text-xs text-[#565B52]">
                      Cần thêm{' '}
                      <span className="font-mono font-medium text-[#171A17] tabular-nums">
                        {pricing.nextTierKg - totalKg}kg
                      </span>{' '}
                      để hưởng giá{' '}
                      <span className="font-mono font-medium text-[#1E4D2B] tabular-nums">
                        {formatVnd(pricing.nextTierUnitPrice)}/kg
                      </span>
                    </p>
                  )}
                </div>

                <div className="inline-flex items-center rounded-md border border-[#DCD9CF] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Giảm số lượng"
                    className="inline-flex h-10 w-10 items-center justify-center text-[#171A17] transition-colors hover:bg-[#F2F1EC]"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span
                    data-testid="pdp-quantity"
                    className="w-12 text-center font-mono text-sm font-semibold text-[#171A17] tabular-nums"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Tăng số lượng"
                    className="inline-flex h-10 w-10 items-center justify-center text-[#171A17] transition-colors hover:bg-[#F2F1EC]"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Summary & Primary CTA */}
            <div className="mt-6 border-t border-[#E5E3DC] pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-[#474C44]">Thành tiền</span>
                <div className="text-right">
                  <div className="font-mono text-xl font-semibold text-[#171A17] tabular-nums">
                    {formatVnd(pricing.subtotal)}
                  </div>
                  {pricing.savings > 0 && (
                    <div className="text-xs font-medium text-[#1E4D2B] tabular-nums">
                      Đã áp dụng giá sỉ — Tiết kiệm {formatVnd(pricing.savings)}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmAdd}
                className="mt-4 inline-flex min-h-[46px] w-full items-center justify-center rounded-md bg-[#155E37] px-5 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0F4628] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#155E37]"
              >
                Thêm vào giỏ hàng ({totalKg.toLocaleString('vi-VN')}kg)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
