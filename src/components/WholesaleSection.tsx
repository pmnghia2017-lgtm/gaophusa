import { useState, type FormEvent } from 'react';
import { Calculator, CheckCircle2, FileText, Truck } from 'lucide-react';
import { BUSINESS_TYPES } from '../data/riceCatalog';
import type {
  PackWeightKg,
  QuoteFormInput,
  QuoteRecord,
  RiceProduct,
  ValidationErrors,
} from '../types/rice';
import {
  calculateLinePricing,
  formatVnd,
  validateQuoteForm,
} from '../utils/pricing';

interface WholesaleSectionProps {
  products: RiceProduct[];
  onQuickAddWholesale: (product: RiceProduct, packWeightKg: PackWeightKg, quantity: number) => void;
  onSubmitQuote: (input: QuoteFormInput, product: RiceProduct) => QuoteRecord;
}

const PRESET_KG_OPTIONS = [50, 200, 500, 1000, 2500];

export function WholesaleSection({
  products,
  onQuickAddWholesale,
  onSubmitQuote,
}: WholesaleSectionProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id ?? '');
  const [calcKg, setCalcKg] = useState<number>(500);

  const [formState, setFormState] = useState<Omit<QuoteFormInput, 'productId' | 'quantityKg'>>({
    contactName: '',
    phone: '',
    businessType: BUSINESS_TYPES[0],
    deliveryArea: '',
    needSample: true,
    needVat: true,
    note: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRecord | null>(null);

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ?? products[0];
  const calcResult = calculateLinePricing(selectedProduct, calcKg);

  const handleAddCalculatedToCart = () => {
    const packWeight: PackWeightKg = selectedProduct.availablePacks.includes(50) ? 50 : 25;
    const bags = Math.max(1, Math.ceil(calcKg / packWeight));
    onQuickAddWholesale(selectedProduct, packWeight, bags);
  };

  const handleQuoteSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: QuoteFormInput = {
      ...formState,
      productId: selectedProduct.id,
      quantityKg: calcKg,
    };

    const validationErrors = validateQuoteForm(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const record = onSubmitQuote(payload, selectedProduct);
    setSubmittedQuote(record);
    setFormState({
      contactName: '',
      phone: '',
      businessType: BUSINESS_TYPES[0],
      deliveryArea: '',
      needSample: true,
      needVat: true,
      note: '',
    });
  };

  return (
    <section
      id="bang-gia-si"
      aria-labelledby="wholesale-heading"
      className="border-y border-[#D4E2D8] bg-[#EEF5F0] py-14 lg:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-[#9A6306]">
            Chính sách B2B · Đại lý, nhà hàng &amp; bếp ăn công nghiệp
          </p>
          <h2
            id="wholesale-heading"
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#12261B] sm:text-4xl"
          >
            Bảng giá sỉ theo sản lượng &amp; dự toán đơn hàng
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#3B4C41]">
            Giá sỉ áp dụng minh bạch theo 3 bậc sản lượng trực tiếp từ nhà máy. Hỗ trợ đóng
            bao 25kg / 50kg theo yêu cầu, gửi mẫu nấu thử miễn phí và xuất hóa đơn VAT đầy đủ.
          </p>
        </div>

        {/* Clean Tabular Wholesale Price Table with Emerald Header & Gold Best-Tier Column */}
        <div className="mt-8 overflow-hidden rounded-xl border border-[#CBE0D2] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#123D27] text-xs font-semibold text-[#E8F3EC]">
                  <th scope="col" className="px-5 py-4">
                    Dòng gạo &amp; Xuất xứ
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Đặc tính cơm
                  </th>
                  <th scope="col" className="px-4 py-4 text-right">
                    Giá lẻ
                  </th>
                  <th scope="col" className="px-4 py-4 text-right">
                    Sỉ 50–499kg
                  </th>
                  <th scope="col" className="px-4 py-4 text-right">
                    Sỉ 500kg–1,9 tấn
                  </th>
                  <th
                    scope="col"
                    className="bg-[#1B5335] px-4 py-4 text-right text-[#F7CA5E]"
                  >
                    Sỉ từ 2 tấn
                  </th>
                  <th scope="col" className="px-5 py-4 text-right">
                    Đặt nhanh
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECE7]">
                {products.map((product) => {
                  const packWeight: PackWeightKg = product.availablePacks.includes(50)
                    ? 50
                    : 25;
                  const qty = packWeight === 50 ? 1 : 2;
                  return (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-[#F7FAF8]"
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-[#12261B]">{product.name}</div>
                        <div className="mt-0.5 text-xs text-[#4B5A50]">
                          {product.origin} · Mã {product.sku}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#3B4C41]">
                        Độ dẻo {product.characteristics.stickiness}/5 · Độ nở{' '}
                        {product.characteristics.fluffiness}/5
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm text-[#5A6A60] tabular-nums">
                        {formatVnd(product.retailPricePerKg)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-medium text-[#12261B] tabular-nums">
                        {formatVnd(product.wholesale.tier50Kg)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-medium text-[#12261B] tabular-nums">
                        {formatVnd(product.wholesale.tier500Kg)}
                      </td>
                      <td className="bg-[#FBF6E8]/75 px-4 py-3.5 text-right text-sm font-bold text-[#155E37] tabular-nums">
                        {formatVnd(product.wholesale.tier2000Kg)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onQuickAddWholesale(product, packWeight, qty)}
                          aria-label={`Đặt sỉ nhanh 50kg ${product.name}`}
                          className="inline-flex min-h-[36px] items-center rounded-md border border-[#155E37] bg-[#EEF6F1] px-3 py-1.5 text-xs font-semibold text-[#155E37] whitespace-nowrap transition-colors hover:bg-[#155E37] hover:text-white"
                        >
                          + 50kg vào giỏ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DCE5DE] bg-[#F7FAF8] px-5 py-3 text-xs text-[#4B5A50]">
            <span>Đơn giá tính theo VNĐ/kg, cập nhật theo vụ lúa hiện hành.</span>
            <span className="font-medium text-[#155E37]">
              Hỗ trợ chiết khấu hợp đồng tháng &amp; công nợ cho đại lý lâu năm.
            </span>
          </div>
        </div>

        {/* Interactive Calculator + B2B Quote Form */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Live Wholesale Tier Calculator */}
          <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#CBE0D2] bg-white shadow-xs lg:col-span-5">
            <div>
              <div className="bg-[#123D27] px-6 py-5 text-white">
                <div className="flex items-center gap-2 text-[#F7CA5E]">
                  <Calculator className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs font-semibold">Dự toán giá sỉ tức thì</span>
                </div>
                <h3 className="mt-1.5 font-display text-2xl font-semibold text-white">
                  Tính nhanh đơn sỉ theo sản lượng
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="calc-product"
                      className="block text-sm font-medium text-[#12261B]"
                    >
                      Chọn dòng gạo
                    </label>
                    <select
                      id="calc-product"
                      value={selectedProduct.id}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-md border border-[#CFDCD3] bg-white px-3 text-sm text-[#12261B] focus:border-[#155E37] focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.origin})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="calc-kg"
                      className="block text-sm font-medium text-[#12261B]"
                    >
                      Sản lượng dự kiến (kg)
                    </label>
                    <input
                      id="calc-kg"
                      type="number"
                      min={50}
                      step={25}
                      value={calcKg}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCalcKg(Number.isFinite(val) ? Math.max(0, val) : 0);
                      }}
                      className="mt-1.5 h-11 w-full rounded-md border border-[#CFDCD3] bg-white px-3 font-mono text-sm text-[#12261B] tabular-nums focus:border-[#155E37] focus:outline-none"
                    />

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {PRESET_KG_OPTIONS.map((kg) => (
                        <button
                          key={kg}
                          type="button"
                          onClick={() => setCalcKg(kg)}
                          className={`min-h-[34px] rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums transition-colors ${
                            calcKg === kg
                              ? 'bg-[#B47409] text-white'
                              : 'bg-[#EEF4F0] text-[#324539] hover:bg-[#DFECE4]'
                          }`}
                        >
                          {kg >= 1000
                            ? `${(kg / 1000).toLocaleString('vi-VN')} tấn`
                            : `${kg} kg`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculation Result Summary */}
                <div
                  data-testid="wholesale-calc-summary"
                  className="mt-6 space-y-3 rounded-lg border border-[#E8D7A7] bg-[#FBF6E8] p-4 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#5C4924]">Bậc giá áp dụng</span>
                    <span className="font-semibold text-[#155E37]">
                      {calcResult.tierLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5C4924]">Đơn giá sỉ</span>
                    <span className="font-semibold text-[#12261B] tabular-nums">
                      {formatVnd(calcResult.unitPricePerKg)}/kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5C4924]">Tiết kiệm so với mua lẻ</span>
                    <span className="font-bold text-[#8F5A05] tabular-nums">
                      {formatVnd(calcResult.savings)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-[#E6D39D] pt-3">
                    <span className="font-semibold text-[#12261B]">Tạm tính lô hàng</span>
                    <span className="text-xl font-bold text-[#155E37] tabular-nums">
                      {formatVnd(calcResult.subtotal)}
                    </span>
                  </div>

                  {calcResult.nextTierKg && calcResult.nextTierUnitPrice && (
                    <p className="text-xs text-[#5C4924]">
                      Nhập từ{' '}
                      <span className="font-semibold text-[#12261B] tabular-nums">
                        {calcResult.nextTierKg.toLocaleString('vi-VN')} kg
                      </span>{' '}
                      để giảm còn{' '}
                      <span className="font-semibold text-[#155E37] tabular-nums">
                        {formatVnd(calcResult.nextTierUnitPrice)}/kg
                      </span>
                      .
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 px-6 pb-6">
              <button
                type="button"
                onClick={handleAddCalculatedToCart}
                disabled={calcKg < 50}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-[#155E37] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F4628] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Thêm lô {calcKg.toLocaleString('vi-VN')}kg vào giỏ hàng
              </button>
              <div className="flex items-center gap-2 text-xs text-[#4B5A50]">
                <Truck className="h-4 w-4 shrink-0 text-[#155E37]" aria-hidden="true" />
                <span>Miễn phí xe tải giao nội thành &amp; gửi chành xe đi tỉnh từ 50kg.</span>
              </div>
            </div>
          </div>

          {/* Right: Wholesale Quote & Free Sample Request Form */}
          <div className="rounded-xl border border-[#CBE0D2] bg-white p-6 shadow-xs lg:col-span-7">
            <div className="flex items-center gap-2 text-[#9A6306]">
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-semibold">Đăng ký báo giá &amp; mẫu thử</span>
            </div>
            <h3 className="mt-2 font-display text-2xl font-semibold text-[#12261B]">
              Nhận bảng giá sỉ riêng &amp; gạo mẫu nấu thử miễn phí
            </h3>
            <p className="mt-1.5 text-sm text-[#4B5A50]">
              Bộ phận kinh doanh sỉ phản hồi báo giá chi tiết và sắp xếp gửi mẫu gạo trong vòng 2
              giờ làm việc.
            </p>

            {submittedQuote && (
              <div
                role="status"
                data-testid="quote-confirmation"
                className="mt-5 rounded-md border border-[#1E4D2B]/30 bg-[#1E4D2B]/5 p-4 text-sm text-[#171A17]"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#1E4D2B]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[#163B20]">
                      Đã tiếp nhận yêu cầu báo giá #{submittedQuote.quoteCode}
                    </p>
                    <p className="mt-1 text-[#474C44]">
                      Dòng gạo: <strong>{submittedQuote.productName}</strong> (
                      <span className="font-mono tabular-nums">
                        {submittedQuote.quantityKg.toLocaleString('vi-VN')} kg
                      </span>{' '}
                      · tạm tính{' '}
                      <span className="font-mono tabular-nums">
                        {formatVnd(submittedQuote.estimatedTotal)}
                      </span>
                      ). Yêu cầu đã được lưu vào mục Tra cứu đơn.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleQuoteSubmit} noValidate className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="quote-name"
                    className="block text-sm font-medium text-[#171A17]"
                  >
                    Họ tên / Tên đơn vị <span className="text-[#9E2A2B]">*</span>
                  </label>
                  <input
                    id="quote-name"
                    type="text"
                    value={formState.contactName}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, contactName: e.target.value }))
                    }
                    placeholder="Ví dụ: Đại lý Gạo Minh Tâm"
                    aria-invalid={Boolean(errors.contactName)}
                    className="mt-1.5 h-11 w-full rounded-md border border-[#DCD9CF] bg-white px-3 text-sm text-[#171A17] focus:border-[#1E4D2B] focus:outline-none"
                  />
                  {errors.contactName && (
                    <p role="alert" className="mt-1 text-xs text-[#9E2A2B]">
                      {errors.contactName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quote-phone"
                    className="block text-sm font-medium text-[#171A17]"
                  >
                    Số điện thoại / Zalo <span className="text-[#9E2A2B]">*</span>
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    value={formState.phone}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, phone: e.target.value }))
                    }
                    placeholder="0908 123 456"
                    aria-invalid={Boolean(errors.phone)}
                    className="mt-1.5 h-11 w-full rounded-md border border-[#DCD9CF] bg-white px-3 text-sm text-[#171A17] focus:border-[#1E4D2B] focus:outline-none"
                  />
                  {errors.phone && (
                    <p role="alert" className="mt-1 text-xs text-[#9E2A2B]">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="quote-business-type"
                    className="block text-sm font-medium text-[#171A17]"
                  >
                    Mô hình kinh doanh
                  </label>
                  <select
                    id="quote-business-type"
                    value={formState.businessType}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, businessType: e.target.value }))
                    }
                    className="mt-1.5 h-11 w-full rounded-md border border-[#DCD9CF] bg-white px-3 text-sm text-[#171A17] focus:border-[#1E4D2B] focus:outline-none"
                  >
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="quote-area"
                    className="block text-sm font-medium text-[#171A17]"
                  >
                    Khu vực giao hàng <span className="text-[#9E2A2B]">*</span>
                  </label>
                  <input
                    id="quote-area"
                    type="text"
                    value={formState.deliveryArea}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, deliveryArea: e.target.value }))
                    }
                    placeholder="Ví dụ: Quận 7, TP.HCM hoặc Bình Dương"
                    aria-invalid={Boolean(errors.deliveryArea)}
                    className="mt-1.5 h-11 w-full rounded-md border border-[#DCD9CF] bg-white px-3 text-sm text-[#171A17] focus:border-[#1E4D2B] focus:outline-none"
                  />
                  {errors.deliveryArea && (
                    <p role="alert" className="mt-1 text-xs text-[#9E2A2B]">
                      {errors.deliveryArea}
                    </p>
                  )}
                </div>
              </div>

              {errors.quantityKg && (
                <p role="alert" className="text-xs text-[#9E2A2B]">
                  {errors.quantityKg}
                </p>
              )}

              <div>
                <label
                  htmlFor="quote-note"
                  className="block text-sm font-medium text-[#171A17]"
                >
                  Yêu cầu thêm (quy cách bao, tần suất nhập hàng)
                </label>
                <textarea
                  id="quote-note"
                  rows={2}
                  value={formState.note}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, note: e.target.value }))
                  }
                  placeholder="Ví dụ: Cần bao 25kg không nhãn riêng, nhập định kỳ mỗi tuần 500kg..."
                  className="mt-1.5 w-full rounded-md border border-[#DCD9CF] bg-white p-3 text-sm text-[#171A17] focus:border-[#1E4D2B] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-sm text-[#474C44]">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formState.needSample}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, needSample: e.target.checked }))
                    }
                    className="h-4 w-4 accent-[#1E4D2B]"
                  />
                  <span>Gửi kèm 2kg gạo mẫu nấu thử miễn phí</span>
                </label>

                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formState.needVat}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, needVat: e.target.checked }))
                    }
                    className="h-4 w-4 accent-[#1E4D2B]"
                  />
                  <span>Cần xuất hóa đơn VAT công ty</span>
                </label>
              </div>

              <div className="flex flex-col justify-between gap-3 border-t border-[#ECEAE3] pt-4 sm:flex-row sm:items-center">
                <p className="text-xs text-[#565B52]">
                  Đang báo giá cho:{' '}
                  <strong className="text-[#171A17]">{selectedProduct.name}</strong> ·{' '}
                  <span className="font-mono tabular-nums">
                    {calcKg.toLocaleString('vi-VN')} kg
                  </span>
                </p>
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#B47409] px-6 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 shadow-xs transition-colors hover:bg-[#965F06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B47409]"
                >
                  Gửi yêu cầu báo giá sỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
