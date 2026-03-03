import Link from 'next/link';
import NavLink from './NavLink';
import NavMobileMenu from './NavMobileMenu';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-bark-950/90 backdrop-blur-md px-4 py-3 flex items-center justify-between">
      <Link href="/" className="text-2xl sm:text-3xl font-bold text-cream-100">
        Tymur Bondar
      </Link>

      <div className="hidden md:flex gap-6">
        {links.map((l) => (
          <NavLink key={l.href} href={l.href}>
            {l.label}
          </NavLink>
        ))}
      </div>

      <NavMobileMenu links={links} />
    </nav>
  );
}
