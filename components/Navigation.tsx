import Link from 'next/link'

export default function Navigation() {
  return (
    <div className="navbar bg-base-200 shadow-lg">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl font-bold">
            Station
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/audience" className="btn btn-ghost">
                Create Audience
              </Link>
            </li>
            <li>
              <Link href="/concepts" className="btn btn-ghost">
                View Concepts
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
