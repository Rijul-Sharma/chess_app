'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/profile', label: 'Profile' },
    { href: '/leaderboards', label: 'Leaderboards' },
    { href: '/tournaments', label: 'Tournaments' }
  ]

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-white font-bold text-xl">
              ♔ Chess App
            </Link>
            
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="text-gray-300 text-sm">
            Powered by Lichess API
          </div>
        </div>
      </div>
    </nav>
  )
}