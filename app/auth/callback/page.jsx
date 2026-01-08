'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/provider'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    // When Supabase finishes restoring session
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light">
      <div className="flex flex-col items-center gap-4 text-slate-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm font-medium">Processing login…</p>
      </div>
    </div>
  )
}
