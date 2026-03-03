'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        isActive
          ? 'text-forest-400 font-semibold border-b-2 border-forest-400 pb-0.5'
          : 'text-cream-200 hover:text-cream-100 transition-colors'
      }
    >
      {children}
    </Link>
  );
}
