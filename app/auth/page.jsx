//app/(main)/auth/page.jsx

'use client'

import React, { useEffect } from 'react'
import { supabase } from '@/services/supabaseClient'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/provider'

function Login() {
  const router = useRouter()
  const { user } = useUser()

  // ✅ If already logged in → skip auth page
 useEffect(() => {
    if (user !== undefined && user !== null) {
      router.replace('/dashboard')
    }
  }, [user, router])

  // Used to Sign In with Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // ✅ Redirect to callback handler, NOT directly to dashboard
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.log('Error: ', error.message)
  }

  // Prevent UI flash while checking auth - only show nothing if loading
  if (user === undefined) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased transition-colors duration-200">
        <div className="flex min-h-screen flex-col">
          {/* Header */}
          <header className="flex w-full items-center justify-between border-b border-slate-200 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 px-6 py-4 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[28px]">smart_toy</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                AI Recruiter
              </h2>
            </div>
          </header>
          {/* Loading skeleton */}
          <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10">
                <div className="h-64 w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 animate-pulse"></div>
                <div className="px-8 py-12 space-y-4">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4 mx-auto"></div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mt-8"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased transition-colors duration-200">
      <div className="flex min-h-screen flex-col">
        <header className="flex w-full items-center justify-between border-b border-slate-200 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 px-6 py-4 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[28px]">smart_toy</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Recruiter
            </h2>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10">
              <div className="relative h-64 w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
                <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-indigo-500/20 blur-xl"></div>

  <Image
  src="/login.png"
  alt="AI illustration"
  width={300}
  height={192}
  unoptimized
/>

              </div>

              <div className="px-8 py-12 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome to AI Recruiter
                </h1>
                <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
                  Sign in to continue to your dashboard
                </p>

                <div className="mt-10">
                  <button
                    onClick={signInWithGoogle}
                    className="group relative flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-4 py-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    <span className="ml-6">Continue with Google</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400">
              Trusted by forward-thinking hiring teams worldwide
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Login
