import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartKg: number;
  onOpenCart: () => void;
}

const NAV_LINKS = [
  { href: '#san-pham', label: 'Sản phẩm' },
  { href: '#bang-gia-si', label: 'Bảng giá sỉ' },
  { href: '#nguon-goc', label: 'Nguồn gốc' },
  { href: '#tra-cuu', label: 'Tra cứu đơn' },
];

export function Header({ cartCount, cartKg, onOpenCart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#DCE5DE] bg-[#FCFBF7]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-element Brand wordmark */}
        <a
          href="#top"
          className="font-display text-xl font-bold tracking-tight text-[#12452A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#155E37]"
        >
          Gạo Phù Sa
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#3B4C41]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#12452A] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#C98A16] after:transition-all after:duration-150 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#155E37]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action (+ compact mobile menu toggle on small screens) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={
              cartCount > 0
                ? `Mở giỏ hàng, hiện có ${cartCount} kiện (${cartKg} kg)`
                : 'Mở giỏ hàng'
            }
            className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[#155E37] px-4 py-2 text-sm font-semibold text-white whitespace-nowrap shrink-0 shadow-xs transition-colors duration-150 hover:bg-[#0F4628] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#155E37]"
          >
            <ShoppingBag className="h-4 w-4 shrink-0 text-[#F5C451]" aria-hidden="true" />
            <span>Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="font-mono text-xs font-semibold tabular-nums text-[#F5C451]">
                ({cartCount})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#CBD8CE] bg-white text-[#12452A] transition-colors hover:bg-[#EEF5F0] md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Điều hướng di động"
          className="border-t border-[#DCE5DE] bg-[#FCFBF7] px-4 py-3 md:hidden"
        >
          <div className="flex flex-col divide-y divide-[#E4ECE6]">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center text-sm font-medium text-[#142219] transition-colors hover:text-[#155E37]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
