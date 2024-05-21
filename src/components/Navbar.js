import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-300">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-2xl">Tymur Bondar</Link>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost sm:hidden">
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
            className="menu menu-sm dropdown-content mt-3 sm:mt-0 z-[1] shadow bg-base-200 rounded-box p-0"
          >
            <li className="">
              <Link href="/about" className="whitespace-nowrap">About Me</Link>
            </li>
            <li>
              <Link href="/portfolio">Projects</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="hidden sm:flex">
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
