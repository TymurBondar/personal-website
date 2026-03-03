'use client';

import { useState } from 'react';
import NavLink from './NavLink';

export default function NavMobileMenu({ links }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="flex flex-col justify-center items-center w-10 h-10"
      >
        <span
          className={`block w-6 h-0.5 bg-cream-100 transition-all duration-300 ${
            open ? 'rotate-45 translate-y-1.5' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-cream-100 transition-all duration-300 my-1 ${
            open ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-cream-100 transition-all duration-300 ${
            open ? '-rotate-45 -translate-y-1.5' : ''
          }`}
        />
      </button>

      <div
        className={`absolute top-full left-0 right-0 bg-bark-900 flex flex-col gap-4 px-6 py-4 transition-all duration-300 ${
          open
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
