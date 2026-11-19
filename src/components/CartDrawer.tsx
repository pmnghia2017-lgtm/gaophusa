import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import type {
  CartSummary,
  CheckoutFormInput,
  OrderRecord,
  PackWeightKg,
  ValidationErrors,
} from '../types/rice';
import { formatVnd, validateCheckoutForm } from '../utils/pricing';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  open: boolean;
  summary: CartSummary;
  onClose: () => void;
  onUpdateQuantity: (productId: string, packWeightKg: PackWeightKg, delta: number) => void;
  onRemoveItem: (productId: string, packWeightKg: PackWeightKg) => void;
  onPlaceOrder: (input: CheckoutFormInput) => OrderRecord;
}

const INITIAL_CHECKOUT_FORM: CheckoutFormInput = {
  customerName: '',
  phone: '',
  address: '',
  note: '',
  paymentMethod: 'cod',
  needVatInvoice: false,
  companyName: '',
  taxCode: '',
};

export function CartDrawer({
  open,
  summary,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [form, setForm] = useState<CheckoutFormInput>(INITIAL_CHECKOUT_FORM);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && summary.lines.length === 0 && step === 'checkout') {
      setStep('cart');
    }
  }, [open, summary.lines.length, step]);

  if (!open) return null;

  const handleCloseDrawer = () => {
    if (step === 'confirmed') {
      setStep('cart');
      setConfirmedOrder(null);
    }
    onClose();
  };

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const order = onPlaceOrder(form);
    setConfirmedOrder(order);
    setForm(INITIAL_CHECKOUT_FORM);
    setStep('confirmed');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-[1px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseDrawer();
      }}
    >
      <div className="flex h-full w-full max-w-lg flex-col border-l border-[#DCD9CF] bg-[#FAFAF8] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between bg-[#123D27] px-5 py-4 text-white">
          <div>
            <h2
              id="cart-drawer-title"
              className="font-display text-xl font-semibold text-white"
            >
              {step === 'cart'
                ? 'Giỏ hàng của bạn'
                : step === 'checkout'
                  ? 'Thông tin giao hàng & thanh toán'
                  : 'Xác nhận đơn hàng'}
            </h2>
            {step !== 'confirmed' && summary.totalPacks > 0 && (
              <p className="mt-0.5 text-xs text-[#C7DFD0] tabular-nums">
                {summary.totalPacks} kiện · Tổng {summary.totalKg.toLocaleString('vi-VN')} kg ·{' '}
                <span className="font-medium text-[#F7CA5E]">
                  {summary.isWholesaleOrder ? 'Áp dụng chính sách đơn sỉ' : 'Đơn hàng bán lẻ'}
                </span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Đóng giỏ hàng"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === 'confirmed' && confirmedOrder ? (
            <div data-testid="order-confirmation" className="space-y-5">
              <div className="rounded-lg border border-[#1E4D2B]/30 bg-[#1E4D2B]/5 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-6 w-6 shrink-0 text-[#1E4D2B]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[#163B20]">
                      Đơn hàng #{confirmedOrder.orderCode} đã được xác nhận
                    </p>
                    <p className="mt-1 text-sm text-[#474C44]">
                      Trạng thái: {confirmedOrder.status}. Nhân viên kho sẽ gọi xác nhận
                      khung giờ giao trong 15 phút.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[#E5E3DC] bg-white p-5 text-sm">
                <h3 className="font-semibold text-[#171A17]">Biên nhận đặt hàng</h3>
                <dl className="mt-3 space-y-2 border-b border-[#ECEAE3] pb-3.5 text-xs">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#565B52]">Người nhận</dt>
                    <dd className="text-right font-medium text-[#171A17]">
                      {confirmedOrder.customerName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#565B52]">Điện thoại</dt>
                    <dd className="font-mono font-medium text-[#171A17]">
                      {confirmedOrder.phone}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#565B52]">Địa chỉ</dt>
                    <dd className="max-w-[65%] text-right text-[#171A17]">
                      {confirmedOrder.address}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#565B52]">Thanh toán</dt>
                    <dd className="font-medium text-[#171A17]">
                      {confirmedOrder.paymentMethod === 'cod'
                        ? 'Thanh toán khi nhận hàng (COD)'
                        : 'Chuyển khoản ngân hàng'}
                    </dd>
                  </div>
                  {confirmedOrder.needVatInvoice && confirmedOrder.companyName && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#565B52]">Hóa đơn VAT</dt>
                      <dd className="text-right text-[#171A17]">
                        {confirmedOrder.companyName} (MST: {confirmedOrder.taxCode})
                      </dd>
                    </div>
                  )}
                </dl>

                <ul className="mt-3 space-y-2 border-b border-[#ECEAE3] pb-3.5 text-xs">
                  {confirmedOrder.items.map((item, idx) => (
                    <li
                      key={`${item.productId}-${idx}`}
                      className="flex justify-between gap-3"
                    >
                      <span className="text-[#474C44]">
                        {item.productName} ({item.quantity} × {item.packWeightKg}kg)
                      </span>
                      <span className="font-mono font-medium text-[#171A17] tabular-nums shrink-0">
                        {formatVnd(item.lineSubtotal)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-medium text-[#171A17]">Tổng thanh toán</span>
                  <span className="font-mono text-lg font-semibold text-[#1E4D2B] tabular-nums">
                    {formatVnd(confirmedOrder.grandTotal)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="#tra-cuu"
                  onClick={handleCloseDrawer}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md border border-[#1E4D2B] px-4 py-2 text-sm font-medium text-[#1E4D2B] transition-colors hover:bg-[#1E4D2B] hover:text-white"
                >
                  Xem trong mục Tra cứu đơn
                </a>
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md bg-[#171A17] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2E332D]"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          ) : summary.lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <p className="text-base font-medium text-[#171A17]">
                Giỏ hàng đang trống
              </p>
              <p className="mt-1.5 max-w-xs text-sm text-[#565B52]">
                Chọn túi gạo 5kg – 10kg cho gia đình hoặc đặt bao 25kg – 50kg để nhận tự động
                chiết khấu sỉ.
              </p>
              <a
                href="#san-pham"
                onClick={handleCloseDrawer}
                className="mt-5 inline-flex min-h-[42px] items-center rounded-md bg-[#1E4D2B] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#163B20]"
              >
                Chọn gạo ngay
              </a>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-4">
              {/* Shipping status callout */}
              <div
                className={`rounded-md border px-4 py-3 text-xs ${
                  summary.isFreeShipping
                    ? 'border-[#CBE0D2] bg-[#EEF6F1] text-[#173D27]'
                    : 'border-[#E8D096] bg-[#FBF4E1] text-[#664104]'
                }`}
              >
                <span className="font-semibold">
                  {summary.isFreeShipping ? 'Miễn phí vận chuyển' : 'Ưu đãi giao hàng'}:
                </span>{' '}
                {summary.freeShippingReason}
              </div>

              {/* Cart Items */}
              <ul className="divide-y divide-[#E5E3DC] rounded-lg border border-[#E5E3DC] bg-white">
                {summary.lines.map((line) => {
                  const key = `${line.item.productId}-${line.item.packWeightKg}`;
                  return (
                    <li key={key} className="flex gap-3.5 p-4">
                      <div className="h-18 w-18 shrink-0 overflow-hidden rounded-md bg-[#F2F1EC]">
                        <ResilientImage
                          src={line.product.image}
                          alt={line.product.imageAlt}
                          fallbackLabel={line.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-[#171A17]">
                              {line.product.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-[#565B52]">
                              {line.item.packWeightKg >= 25
                                ? `Bao ${line.item.packWeightKg}kg`
                                : `Túi ${line.item.packWeightKg}kg`}{' '}
                              · {line.appliedTierLabel} (
                              <span className="font-mono tabular-nums">
                                {formatVnd(line.appliedUnitPricePerKg)}/kg
                              </span>
                              )
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onRemoveItem(line.item.productId, line.item.packWeightKg)
                            }
                            aria-label={`Xóa ${line.product.name} loại ${line.item.packWeightKg}kg khỏi giỏ`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6B7066] transition-colors hover:bg-[#F2F1EC] hover:text-[#9E2A2B]"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center rounded-md border border-[#DCD9CF]">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(
                                  line.item.productId,
                                  line.item.packWeightKg,
                                  -1
                                )
                              }
                              aria-label={`Giảm số lượng ${line.product.name} loại ${line.item.packWeightKg}kg`}
                              className="inline-flex h-8 w-8 items-center justify-center text-[#171A17] hover:bg-[#F2F1EC]"
                            >
                              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <span className="w-9 text-center font-mono text-xs font-semibold tabular-nums">
                              {line.item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(
                                  line.item.productId,
                                  line.item.packWeightKg,
                                  1
                                )
                              }
                              aria-label={`Tăng số lượng ${line.product.name} loại ${line.item.packWeightKg}kg`}
                              className="inline-flex h-8 w-8 items-center justify-center text-[#171A17] hover:bg-[#F2F1EC]"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="font-mono text-sm font-semibold text-[#171A17] tabular-nums">
                              {formatVnd(line.lineSubtotal)}
                            </div>
                            <div className="font-mono text-[11px] text-[#565B52] tabular-nums">
                              Tổng {line.lineKg} kg
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            /* Checkout Form Step */
            <form
              id="checkout-form"
              onSubmit={handleCheckoutSubmit}
              noValidate
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-sm font-medium text-[#171A17]"
                >
                  Họ tên người nhận / Tên cửa hàng <span className="text-[#9E2A2B]">*</span>
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customerName: e.target.value }))
                  }
                  placeholder="Nguyễn Văn An"
                  aria-invalid={Boolean(errors.customerName)}
                  className="mt-1.5 h-11 w-full rounded-md border border-[#DCD9CF] bg-white px-3 text-sm text-[#171A17] focus:border-[#1E4D2B] focus:outline-none"
                />
                {errors.customerName && (
                  <p role="alert" className="mt-1 text-xs text-[#9E2A2B]">
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-sm font-medium text-[#171A17]"
                >
                  Số điện thoại nhận hàng <span className="text-[#9E2A2B]">*</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="0909 123 456"
                  aria-invalid={Boolean(errors.phone)}
                  className="mt-1.5 h-11 w-full rounded-md border border-[#DCD9CF] bg-white px-3 text-sm text-[#171A17] focus:border-[#1E4D2B] focus:outline-none"
                />
                {errors.phone && (
                  <p role="alert" className="mt-1 text-xs text-[#9E2A2B]">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-sm font-medium text-[#171A17]"
                >
                  Địa chỉ giao hàng chi tiết <span className="text-[#9E2A2B]">*</span>
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                  aria-invalid={Boolean(errors.address)}
                  className="mt-1.5 h-11 w-full rounded-md border border-[#DCD9CF] bg-white px-3 text-sm text-[#171A17] focus:border-[#1E4D2B] focus:outline-none"
                />
                {errors.address && (
                  <p role="alert" className="mt-1 text-xs text-[#9E2A2B]">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <fieldset className="space-y-2 pt-1">
                <legend className="text-sm font-medium text-[#171A17]">
                  Hình thức thanh toán
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-center gap-2.5 rounded-md border p-3 text-xs font-medium transition-colors ${
                      form.paymentMethod === 'cod'
                        ? 'border-[#1E4D2B] bg-[#1E4D2B]/5 text-[#171A17]'
                        : 'border-[#DCD9CF] bg-white text-[#474C44]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === 'cod'}
                      onChange={() => setForm((f) => ({ ...f, paymentMethod: 'cod' }))}
                      className="accent-[#1E4D2B]"
                    />
                    <span>Tiền mặt khi nhận (COD)</span>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center gap-2.5 rounded-md border p-3 text-xs font-medium transition-colors ${
                      form.paymentMethod === 'bank_transfer'
                        ? 'border-[#1E4D2B] bg-[#1E4D2B]/5 text-[#171A17]'
                        : 'border-[#DCD9CF] bg-white text-[#474C44]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={form.paymentMethod === 'bank_transfer'}
                      onChange={() =>
                        setForm((f) => ({ ...f, paymentMethod: 'bank_transfer' }))
                      }
                      className="accent-[#1E4D2B]"
                    />
                    <span>Chuyển khoản ngân hàng</span>
                  </label>
                </div>
              </fieldset>

              {/* VAT Invoice Option */}
              <div className="rounded-md border border-[#E5E3DC] bg-white p-3.5">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[#171A17]">
                  <input
                    type="checkbox"
                    checked={form.needVatInvoice}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, needVatInvoice: e.target.checked }))
                    }
                    className="h-4 w-4 accent-[#1E4D2B]"
                  />
                  <span>Xuất hóa đơn VAT công ty / hộ kinh doanh</span>
                </label>

                {form.needVatInvoice && (
                  <div className="mt-3 space-y-3 border-t border-[#ECEAE3] pt-3">
                    <div>
                      <label
                        htmlFor="checkout-company"
                        className="block text-xs font-medium text-[#171A17]"
                      >
                        Tên công ty / Đơn vị <span className="text-[#9E2A2B]">*</span>
                      </label>
                      <input
                        id="checkout-company"
                        type="text"
                        value={form.companyName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, companyName: e.target.value }))
                        }
                        placeholder="Công ty TNHH Thực Phẩm..."
                        className="mt-1 h-10 w-full rounded-md border border-[#DCD9CF] bg-white px-3 text-sm focus:border-[#1E4D2B] focus:outline-none"
                      />
                      {errors.companyName && (
                        <p role="alert" className="mt-1 text-xs text-[#9E2A2B]">
                          {errors.companyName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="checkout-tax"
                        className="block text-xs font-medium text-[#171A17]"
                      >
                        Mã số thuế <span className="text-[#9E2A2B]">*</span>
                      </label>
                      <input
                        id="checkout-tax"
                        type="text"
                        value={form.taxCode}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, taxCode: e.target.value }))
                        }
                        placeholder="0312345678"
                        className="mt-1 h-10 w-full rounded-md border border-[#DCD9CF] bg-white px-3 font-mono text-sm focus:border-[#1E4D2B] focus:outline-none"
                      />
                      {errors.taxCode && (
                        <p role="alert" className="mt-1 text-xs text-[#9E2A2B]">
                          {errors.taxCode}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-note"
                  className="block text-sm font-medium text-[#171A17]"
                >
                  Ghi chú giao hàng
                </label>
                <textarea
                  id="checkout-note"
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="Khung giờ nhận hàng, yêu cầu bốc xếp hoặc chành xe..."
                  className="mt-1.5 w-full rounded-md border border-[#DCD9CF] bg-white p-3 text-sm text-[#171A17] focus:border-[#1E4D2B] focus:outline-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {step !== 'confirmed' && summary.lines.length > 0 && (
          <div className="border-t border-[#E5E3DC] bg-white px-5 py-4">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#565B52]">
                <dt>Tạm tính ({summary.totalKg.toLocaleString('vi-VN')} kg)</dt>
                <dd className="font-mono text-[#171A17] tabular-nums">
                  {formatVnd(summary.subtotal)}
                </dd>
              </div>
              {summary.totalSavings > 0 && (
                <div className="flex justify-between text-[#1E4D2B]">
                  <dt>Chiết khấu sỉ đã trừ</dt>
                  <dd className="font-mono font-medium tabular-nums">
                    -{formatVnd(summary.totalSavings)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between text-[#565B52]">
                <dt>Phí vận chuyển</dt>
                <dd className="font-mono text-[#171A17] tabular-nums">
                  {summary.shippingFee === 0 ? 'Miễn phí' : formatVnd(summary.shippingFee)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#ECEAE3] pt-2.5 text-base font-semibold text-[#171A17]">
                <dt>Tổng thanh toán</dt>
                <dd
                  data-testid="cart-grand-total"
                  className="font-mono text-lg text-[#171A17] tabular-nums"
                >
                  {formatVnd(summary.grandTotal)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex gap-2.5">
              {step === 'checkout' && (
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[#DCD9CF] px-4 py-2 text-sm font-medium text-[#171A17] transition-colors hover:bg-[#F2F1EC]"
                >
                  Quay lại
                </button>
              )}

              {step === 'cart' ? (
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md bg-[#155E37] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F4628]"
                >
                  Tiến hành đặt hàng
                </button>
              ) : (
                <button
                  type="submit"
                  form="checkout-form"
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md bg-[#155E37] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F4628]"
                >
                  Xác nhận đặt hàng ({formatVnd(summary.grandTotal)})
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
