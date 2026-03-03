'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-4 py-3 bg-gray-900">
      {/* Logo */}
      <Link href="/" className="text-2xl sm:text-3xl font-bold text-gray-100">
        Tymur Bondar
      </Link>

      {/* Desktop nav — hidden on mobile */}
      <ul className="hidden sm:flex gap-6 text-lg text-gray-100">
        <li><Link href="/about">About Me</Link></li>
        <li><Link href="/portfolio">Projects</Link></li>
      </ul>

      {/* Hamburger — visible on mobile only */}
      <button
        className="sm:hidden text-gray-100 p-1"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </button>

      {/* Mobile dropdown — conditionally rendered */}
      {isMenuOpen && (
        <ul className="absolute top-14 right-4 bg-gray-800 rounded shadow-sm p-2 flex flex-col gap-1 z-10">
          <li>
            <Link href="/about" className="block px-4 py-2 text-gray-100 text-lg whitespace-nowrap">
              About Me
            </Link>
          </li>
          <li>
            <Link href="/portfolio" className="block px-4 py-2 text-gray-100 text-lg">
              Projects
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
