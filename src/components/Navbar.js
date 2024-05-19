import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 border-2 border-green-500">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-2xl">Tymur Bondar</Link>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content shadow bg-base-100 rounded-box border-2 border-yellow-500 w-28"
          >
            <li>
              <Link href="/about">About Me</Link>
            </li>
            <li>
              <Link href="/portfolio">Projects</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/about">About Me</Link>
            </li>
            <li>
              <Link href="/portfolio">Projects</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
