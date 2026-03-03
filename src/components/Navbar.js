import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-bark-950">
      <Link href="/" className="text-2xl sm:text-3xl font-bold text-cream-100">
        Tymur Bondar
      </Link>
    </nav>
  );
}
