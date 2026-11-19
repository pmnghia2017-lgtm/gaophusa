import { useState } from 'react';
import { Search } from 'lucide-react';
import { MILL_STORY_IMAGE, PARTNER_TESTIMONIALS } from '../data/riceCatalog';
import type { OrderRecord, QuoteRecord } from '../types/rice';
import { formatVnd, normalizeVietnamese } from '../utils/pricing';
import { ResilientImage } from './ResilientImage';

interface OriginAndOrdersSectionProps {
  orders: OrderRecord[];
  quotes: QuoteRecord[];
}

const MILL_STANDARDS = [
  {
    index: '01.',
    title: 'Thu mua trực tiếp tại vùng nguyên liệu',
    detail:
      'Liên kết trực tiếp với hợp tác xã tại Sóc Trăng, Bạc Liêu, Long An và Tiền Giang. Kiểm định độ ẩm lúa tươi dưới 14% ngay khi nhập kho.',
  },
  {
    index: '02.',
    title: 'Xay xát mới theo lịch giao hàng',
    detail:
      'Hệ thống tách màu quang học loại bỏ hạt bạc bụng và tạp chất, giữ tỷ lệ tấm dưới 5% đối với gạo đặc sản. Không tẩy trắng, không chất tạo mùi.',
  },
  {
    index: '03.',
    title: 'Đóng gói chuẩn trọng lượng & pháp lý đầy đủ',
    detail:
      'Cung cấp túi 5kg, 10kg hút chân không hoặc bao PP 25kg, 50kg cho đại lý. Đầy đủ hồ sơ công bố sản phẩm, kiểm nghiệm VSATTP và hóa đơn VAT.',
  },
];

function formatDateVi(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function OriginAndOrdersSection({
  orders,
  quotes,
}: OriginAndOrdersSectionProps) {
  const [lookupQuery, setLookupQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'quotes'>('orders');

  const normalized = normalizeVietnamese(lookupQuery);

  const filteredOrders = orders.filter((order) => {
    if (!normalized) return true;
    return normalizeVietnamese(
      `${order.orderCode} ${order.phone} ${order.customerName}`
    ).includes(normalized);
  });

  const filteredQuotes = quotes.filter((quote) => {
    if (!normalized) return true;
    return normalizeVietnamese(
      `${quote.quoteCode} ${quote.phone} ${quote.contactName} ${quote.productName}`
    ).includes(normalized);
  });

  return (
    <div className="bg-[#FCFBF7]">
      {/* Origin & Milling Craft Section on warm harvest ivory */}
      <section
        id="nguon-goc"
        aria-labelledby="origin-heading"
        className="border-b border-[#E5DEC9] bg-[#FBF7EC]"
      >
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="overflow-hidden rounded-xl border border-[#DFD5BC] bg-[#F2EDE0] shadow-xs lg:col-span-5">
              <div className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[380px]">
                <ResilientImage
                  src={MILL_STORY_IMAGE}
                  alt="Chuyên viên kiểm định hạt gạo trắng trong trên khay kiểm tra chất lượng tại nhà máy xay xát"
                  fallbackLabel="Quy trình kiểm định chất lượng tại nhà máy Gạo Phù Sa"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <p className="text-xs font-semibold text-[#9A6306]">
                  Quy chuẩn nhà máy · Kiểm định từng lô xuất kho
                </p>
                <h2
                  id="origin-heading"
                  className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#12261B] sm:text-4xl"
                >
                  Chất lượng đồng nhất từ hạt lúa đến nồi cơm
                </h2>

                <ol className="mt-6 divide-y divide-[#E4DCC7] border-y border-[#E4DCC7]">
                  {MILL_STANDARDS.map((item) => (
                    <li key={item.index} className="py-4">
                      <h3 className="text-base font-semibold text-[#12261B]">
                        <span className="mr-2 font-mono text-sm font-semibold text-[#155E37]">
                          {item.index}{' '}
                        </span>
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#3B4C41]">
                        {item.detail}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Attributable Partner Testimonials adjacent to origin claim */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PARTNER_TESTIMONIALS.map((item) => (
              <figure
                key={item.name}
                className="flex flex-col justify-between rounded-xl border border-[#E4DCC7] bg-white p-6 shadow-xs"
              >
                <blockquote className="text-sm leading-relaxed text-[#2D3C33]">
                  <span
                    aria-hidden="true"
                    className="mr-1 font-display text-lg font-bold text-[#C98A16]"
                  >
                    “
                  </span>
                  {item.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-[#EEE8D8] pt-4">
                  <div className="text-sm font-semibold text-[#12261B]">{item.name}</div>
                  <div className="mt-0.5 text-xs text-[#4B5A50]">
                    {item.role} ·{' '}
                    <span className="font-medium text-[#155E37]">{item.organization}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Order & Wholesale Quote Lookup Section */}
      <section
        id="tra-cuu"
        aria-labelledby="lookup-heading"
        className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold text-[#155E37]">
              Theo dõi giao nhận &amp; lịch sử báo giá
            </p>
            <h2
              id="lookup-heading"
              className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#12261B]"
            >
              Tra cứu đơn hàng &amp; yêu cầu báo giá
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              role="tablist"
              aria-label="Chọn danh sách tra cứu"
              className="inline-flex rounded-lg border border-[#D4DFD7] bg-[#EEF4F0] p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'orders'}
                onClick={() => setActiveTab('orders')}
                className={`min-h-[38px] rounded-md px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[#155E37] text-white shadow-xs'
                    : 'text-[#3B4C41] hover:text-[#12261B]'
                }`}
              >
                Đơn đặt hàng ({orders.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'quotes'}
                onClick={() => setActiveTab('quotes')}
                className={`min-h-[38px] rounded-md px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'quotes'
                    ? 'bg-[#B47409] text-white shadow-xs'
                    : 'text-[#3B4C41] hover:text-[#12261B]'
                }`}
              >
                Báo giá sỉ ({quotes.length})
              </button>
            </div>

            <div className="relative sm:w-64">
              <label htmlFor="order-lookup-input" className="sr-only">
                Nhập mã đơn hoặc số điện thoại để tra cứu
              </label>
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#556B5D]"
                aria-hidden="true"
              />
              <input
                id="order-lookup-input"
                type="search"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="Mã đơn GPS-... hoặc SĐT"
                className="h-10 w-full rounded-md border border-[#CFDCD3] bg-white pr-3 pl-9 text-sm text-[#12261B] placeholder:text-[#6C7F72] focus:border-[#155E37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results List */}
        {activeTab === 'orders' ? (
          <div data-testid="orders-list" className="mt-6 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="rounded-xl border border-[#DCE5DE] bg-white p-8 text-center text-sm text-[#4B5A50]">
                Không tìm thấy đơn hàng khớp với “{lookupQuery}”.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <article
                  key={order.orderCode}
                  className="rounded-xl border border-[#DCE5DE] bg-white p-5 shadow-xs"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E8EFEA] pb-3.5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-sm font-semibold text-[#12261B]">
                        #{order.orderCode}
                      </span>
                      <span className="text-xs text-[#4B5A50]">
                        {formatDateVi(order.createdAt)}
                      </span>
                      <span aria-hidden="true" className="text-[#C98A16]">
                        ·
                      </span>
                      <span className="text-xs font-semibold text-[#155E37]">
                        {order.status}
                      </span>
                    </div>

                    <div className="text-base font-bold text-[#155E37] tabular-nums">
                      {formatVnd(order.grandTotal)}
                    </div>
                  </div>

                  <div className="mt-3.5 grid grid-cols-1 gap-4 text-sm md:grid-cols-12">
                    <div className="space-y-1 md:col-span-5">
                      <p className="font-semibold text-[#12261B]">
                        {order.customerName} ·{' '}
                        <span className="font-mono text-xs font-normal text-[#3B4C41]">
                          {order.phone}
                        </span>
                      </p>
                      <p className="text-xs text-[#4B5A50]">{order.address}</p>
                      <p className="text-xs text-[#4B5A50]">
                        <span
                          className={
                            order.isWholesaleOrder
                              ? 'font-semibold text-[#9A6306]'
                              : 'font-semibold text-[#155E37]'
                          }
                        >
                          {order.isWholesaleOrder ? 'Đơn sỉ' : 'Đơn lẻ'}
                        </span>{' '}
                        · Tổng{' '}
                        <span className="font-mono tabular-nums">{order.totalKg} kg</span> ·{' '}
                        {order.paymentMethod === 'cod'
                          ? 'Thanh toán khi nhận hàng (COD)'
                          : 'Chuyển khoản ngân hàng'}
                        {order.needVatInvoice && order.taxCode
                          ? ` · VAT (${order.taxCode})`
                          : ''}
                      </p>
                    </div>

                    <ul className="space-y-1.5 text-xs text-[#3B4C41] md:col-span-7">
                      {order.items.map((line, idx) => (
                        <li
                          key={`${order.orderCode}-${line.productId}-${idx}`}
                          className="flex items-baseline justify-between gap-4"
                        >
                          <span>
                            {line.productName} — {line.quantity} ×{' '}
                            {line.packWeightKg >= 25 ? 'bao' : 'túi'} {line.packWeightKg}kg (
                            {line.tierLabel})
                          </span>
                          <span className="font-semibold text-[#12261B] tabular-nums shrink-0">
                            {formatVnd(line.lineSubtotal)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))
            )}
          </div>
        ) : (
          <div data-testid="quotes-list" className="mt-6 space-y-4">
            {filteredQuotes.length === 0 ? (
              <div className="rounded-xl border border-[#DCE5DE] bg-white p-8 text-center text-sm text-[#4B5A50]">
                Không tìm thấy yêu cầu báo giá khớp với “{lookupQuery}”.
              </div>
            ) : (
              filteredQuotes.map((quote) => (
                <article
                  key={quote.quoteCode}
                  className="rounded-xl border border-[#E6D9BA] bg-white p-5 shadow-xs"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#EFE8D5] pb-3">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-sm font-semibold text-[#12261B]">
                        #{quote.quoteCode}
                      </span>
                      <span className="text-xs text-[#4B5A50]">
                        {formatDateVi(quote.createdAt)}
                      </span>
                      <span aria-hidden="true" className="text-[#C98A16]">
                        ·
                      </span>
                      <span className="text-xs font-semibold text-[#9A6306]">
                        {quote.status}
                      </span>
                    </div>
                    <span className="text-base font-bold text-[#8F5A05] tabular-nums">
                      Tạm tính {formatVnd(quote.estimatedTotal)}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-[#3B4C41] sm:grid-cols-2">
                    <p>
                      <strong className="text-[#12261B]">{quote.contactName}</strong> (
                      {quote.businessType}) · {quote.phone}
                    </p>
                    <p className="sm:text-right">
                      {quote.productName} ·{' '}
                      <span className="font-mono font-medium text-[#12261B] tabular-nums">
                        {quote.quantityKg.toLocaleString('vi-VN')} kg
                      </span>{' '}
                      ({formatVnd(quote.estimatedUnitPrice)}/kg)
                    </p>
                    <p>Khu vực: {quote.deliveryArea}</p>
                    <p className="sm:text-right">
                      {quote.needSample ? 'Có gửi mẫu thử 2kg' : 'Không cần mẫu thử'} ·{' '}
                      {quote.needVat ? 'Có xuất VAT' : 'Không cần VAT'}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
