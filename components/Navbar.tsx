// components/Navbar.tsx
'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar({ userName }: { userName?: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
          TaskFlow
        </Link>
        <div className="flex items-center gap-4">
          {userName && (
            <span className="text-gray-600 text-sm">Hi, {userName} 👋</span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}