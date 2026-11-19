import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORY_OPTIONS } from '../data/riceCatalog';
import type {
  PackWeightKg,
  PurchaseMode,
  RiceCategory,
  RiceProduct,
  SortOption,
} from '../types/rice';
import { formatVnd } from '../utils/pricing';
import { ResilientImage } from './ResilientImage';

interface CatalogSectionProps {
  products: RiceProduct[];
  mode: PurchaseMode;
  category: RiceCategory;
  searchQuery: string;
  sortBy: SortOption;
  onModeChange: (mode: PurchaseMode) => void;
  onCategoryChange: (cat: RiceCategory) => void;
  onSearchChange: (q: string) => void;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  onSelectProduct: (product: RiceProduct) => void;
  onQuickAdd: (product: RiceProduct, packWeightKg: PackWeightKg, quantity: number) => void;
}

function GrainMeter({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'emerald' | 'gold';
}) {
  const activeColor = tone === 'emerald' ? 'bg-[#1D7344]' : 'bg-[#D0901A]';
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-[#4B5A50]">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((step) => (
            <span
              key={step}
              className={`h-1.5 w-3.5 rounded-[2px] ${
                step <= value ? activeColor : 'bg-[#E3E7E2]'
              }`}
            />
          ))}
        </div>
        <span className="w-6 text-right font-medium text-[#142219] tabular-nums">
          {value}/5
        </span>
      </div>
    </div>
  );
}

export function CatalogSection({
  products,
  mode,
  category,
  searchQuery,
  sortBy,
  onModeChange,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onResetFilters,
  onSelectProduct,
  onQuickAdd,
}: CatalogSectionProps) {
  return (
    <section
      id="san-pham"
      aria-labelledby="catalog-heading"
      className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      {/* Section Header + Purchase Mode Switcher */}
      <div className="flex flex-col justify-between gap-6 border-b border-[#DCE5DE] pb-8 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold text-[#155E37]">
            Danh mục gạo vụ mới · Giao trực tiếp từ kho tổng
          </p>
          <h2
            id="catalog-heading"
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#12261B] sm:text-4xl"
          >
            Tuyển chọn các dòng gạo chủ lực
          </h2>
        </div>

        {/* Dual-mode Retail / Wholesale segmented control */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#4B5A50]">Chế độ hiển thị giá</span>
          <div
            role="group"
            aria-label="Chọn chế độ mua lẻ hoặc mua sỉ"
            className="inline-flex rounded-lg border border-[#D4DFD7] bg-[#EEF4F0] p-1"
          >
            <button
              type="button"
              onClick={() => onModeChange('retail')}
              aria-pressed={mode === 'retail'}
              className={`min-h-[40px] rounded-md px-4 py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                mode === 'retail'
                  ? 'bg-[#155E37] text-white shadow-xs'
                  : 'text-[#3B4C41] hover:text-[#12261B]'
              }`}
            >
              Mua lẻ (Gia đình)
            </button>
            <button
              type="button"
              onClick={() => onModeChange('wholesale')}
              aria-pressed={mode === 'wholesale'}
              className={`min-h-[40px] rounded-md px-4 py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                mode === 'wholesale'
                  ? 'bg-[#B47409] text-white shadow-xs'
                  : 'text-[#3B4C41] hover:text-[#12261B]'
              }`}
            >
              Mua sỉ (Đại lý &amp; Bếp ăn)
            </button>
          </div>
        </div>
      </div>

      {/* Mode explanatory banner with clear color coding */}
      <div
        className={`mt-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm transition-colors ${
          mode === 'retail'
            ? 'border-[#CBE0D2] bg-[#EEF6F1] text-[#173D27]'
            : 'border-[#E8D096] bg-[#FBF4E1] text-[#664104]'
        }`}
      >
        <p className="font-medium">
          {mode === 'retail'
            ? 'Đang xem giá bán lẻ đóng túi 5kg – 10kg. Miễn phí giao tận nhà cho đơn từ 300.000 đ.'
            : 'Đang xem giá sỉ tận nhà máy (từ 50kg trở lên). Tự động giảm thêm ở mốc 500kg và 2 tấn.'}
        </p>
        <span className="font-mono text-xs font-medium tabular-nums">
          Hiển thị {products.length} dòng gạo
        </span>
      </div>

      {/* Category filter buttons + Search & Sort toolbar */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Lọc theo phân loại gạo"
          className="flex flex-wrap items-center gap-1.5"
        >
          {CATEGORY_OPTIONS.map((opt) => {
            const active = category === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onCategoryChange(opt.id)}
                className={`min-h-[40px] rounded-md px-3.5 py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  active
                    ? 'bg-[#123D27] text-white'
                    : 'bg-[#EEF4F0] text-[#324539] hover:bg-[#DFECE4] hover:text-[#12261B]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:w-64">
            <label htmlFor="rice-search" className="sr-only">
              Tìm tên gạo, xuất xứ hoặc đặc tính
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#556B5D]"
              aria-hidden="true"
            />
            <input
              id="rice-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm ST25, Sóc Trăng, cơm tấm..."
              className="h-10 w-full rounded-md border border-[#CFDCD3] bg-white pr-3 pl-9 text-sm text-[#142219] placeholder:text-[#6C7F72] focus:border-[#155E37] focus:outline-none"
            />
          </div>

          <div className="relative flex items-center gap-2">
            <SlidersHorizontal
              className="h-4 w-4 shrink-0 text-[#556B5D]"
              aria-hidden="true"
            />
            <label htmlFor="rice-sort" className="sr-only">
              Sắp xếp danh sách gạo
            </label>
            <select
              id="rice-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-10 rounded-md border border-[#CFDCD3] bg-white px-3 text-sm text-[#142219] focus:border-[#155E37] focus:outline-none"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="price-asc">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {products.length === 0 ? (
        <div className="mt-10 rounded-xl border border-[#DCE5DE] bg-white px-6 py-14 text-center">
          <p className="text-base font-medium text-[#12261B]">
            Không tìm thấy dòng gạo phù hợp với từ khóa “{searchQuery}”.
          </p>
          <p className="mt-1.5 text-sm text-[#4B5A50]">
            Thử tìm theo tên giống gạo (ST25, Nàng Hoa, Tài Nguyên, 504) hoặc xem lại tất cả danh mục.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 inline-flex min-h-[40px] items-center rounded-md border border-[#155E37] px-4 py-2 text-sm font-semibold text-[#155E37] transition-colors hover:bg-[#155E37] hover:text-white"
          >
            Hiển thị tất cả các dòng gạo
          </button>
        </div>
      ) : (
        <div
          data-testid="product-grid"
          className="mt-8 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => {
            const defaultPack: PackWeightKg =
              mode === 'wholesale'
                ? product.availablePacks.includes(50)
                  ? 50
                  : 25
                : product.availablePacks.includes(5)
                  ? 5
                  : 10;

            const defaultQty = mode === 'wholesale' && defaultPack === 25 ? 2 : 1;
            const unitPrice =
              mode === 'wholesale'
                ? product.wholesale.tier50Kg
                : product.retailPricePerKg;
            const quickAddKg = defaultPack * defaultQty;

            return (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#DCE5DE] bg-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:border-[#9EC2AB] hover:shadow-md"
              >
                {/* Product Image Trigger */}
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  aria-label={`Xem chi tiết ${product.name}`}
                  className="block aspect-[4/3] w-full overflow-hidden bg-[#F2F0E8] text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#155E37]"
                >
                  <ResilientImage
                    src={product.image}
                    alt={product.imageAlt}
                    fallbackLabel={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </button>

                {/* Uniform Content Area */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Quiet unboxed metadata line */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-[#4B5A50]">
                      {product.categoryLabel} · {product.origin}
                    </span>
                    {product.highlightTag && (
                      <span className="font-semibold text-[#9A6306]">
                        {product.highlightTag}
                      </span>
                    )}
                  </div>

                  {/* Product Title */}
                  <h3 className="mt-2 text-base font-semibold leading-snug text-[#12261B]">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="text-left transition-colors hover:text-[#155E37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#155E37]"
                    >
                      {product.name}
                    </button>
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4B5A50]">
                    {product.shortNote}
                  </p>

                  {/* Visual Grain Profile Meters */}
                  <div className="mt-3.5 space-y-1.5 rounded-md bg-[#F7F9F7] px-3 py-2.5">
                    <GrainMeter
                      label="Độ dẻo"
                      value={product.characteristics.stickiness}
                      tone="emerald"
                    />
                    <GrainMeter
                      label="Độ nở"
                      value={product.characteristics.fluffiness}
                      tone="gold"
                    />
                  </div>

                  {/* Price & Actions pinned to bottom */}
                  <div className="mt-auto pt-4">
                    <div className="flex items-baseline justify-between border-t border-[#E6ECE7] pt-4">
                      <div>
                        <p className="text-xs text-[#4B5A50]">
                          {mode === 'wholesale' ? 'Giá sỉ (50–499kg)' : 'Giá bán lẻ'}
                        </p>
                        <p
                          className={`mt-0.5 text-lg font-bold tabular-nums ${
                            mode === 'wholesale' ? 'text-[#8F5A05]' : 'text-[#155E37]'
                          }`}
                        >
                          {formatVnd(unitPrice)}
                          <span className="text-xs font-normal text-[#4B5A50]">/kg</span>
                        </p>
                      </div>

                      <div className="text-right">
                        {mode === 'wholesale' ? (
                          <>
                            <p className="text-xs text-[#4B5A50]">Từ 2 tấn chỉ còn</p>
                            <p className="mt-0.5 text-sm font-semibold text-[#155E37] tabular-nums">
                              {formatVnd(product.wholesale.tier2000Kg)}/kg
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-[#4B5A50]">Túi {defaultPack}kg</p>
                            <p className="mt-0.5 text-sm font-semibold text-[#12261B] tabular-nums">
                              {formatVnd(unitPrice * defaultPack)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onQuickAdd(product, defaultPack, defaultQty)}
                        aria-label={`Thêm ${quickAddKg}kg ${product.name} vào giỏ hàng`}
                        className={`inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-semibold text-white whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                          mode === 'wholesale'
                            ? 'bg-[#B47409] hover:bg-[#965F06] focus-visible:outline-[#B47409]'
                            : 'bg-[#155E37] hover:bg-[#0F4628] focus-visible:outline-[#155E37]'
                        }`}
                      >
                        <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>
                          {mode === 'wholesale'
                            ? `Thêm lô ${quickAddKg}kg`
                            : `Thêm túi ${defaultPack}kg`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        aria-label={`Chọn quy cách cho ${product.name}`}
                        className="inline-flex min-h-[42px] items-center justify-center rounded-md border border-[#CBD8CE] bg-white px-3.5 py-2 text-sm font-medium text-[#142219] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#155E37] hover:text-[#155E37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#155E37]"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
