// app/auth/page.jsx

'use client'
import React from 'react'
import { supabase } from '@/services/supabaseClient'
import Image from 'next/image'

function Login() {
  // Used to Sign In with Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.log('Error: ', error.message)
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased transition-colors duration-200">
      <div className="flex min-h-screen flex-col">
        <header className="flex w-full items-center justify-between border-b border-slate-200 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 px-6 py-4 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[28px]">smart_toy</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AI Recruiter</h2>
          </div>
          <div></div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10">
              <div className="relative h-64 w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
                <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-indigo-500/20 blur-xl"></div>
                <Image 
                  alt="3D abstract render of connected nodes representing AI network" 
                  className="relative z-10 h-48 w-auto object-contain drop-shadow-lg transition-transform hover:scale-105 duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHX7D3adccK8DKicwUcA4-loKyazpZ8nQov8QnL-0aeqe7LpZjvJ5hhptj_Y3GMtw0jtXMa7RkHDxSn-xPMjtcLAHQgjVrBHu5X9Z-w2M01lqJwS-ufTI_Tpt6w4r5MoJ2FWTcPqUYcFyFSIJUkKZUmzUmLdVpmd9Ji46fltPcueI4SePZqfIY3KKKwUm2me0A1XLHPzPsgjwByCCBLm-1gyrpr0rLQMFEwmHClniOn6ZZ4M"
                />
              </div>
              <div className="px-8 py-12 text-center">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                  Welcome to AICruiter
                </h1>
                <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
                  Experience the future of hassle-free hiring with AI-driven insights.
                </p>
                <div className="mt-10">
                  <div className="relative">
                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white dark:bg-slate-900 px-2 text-sm text-slate-400 dark:text-slate-500">Sign In With Google Authentication</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button 
                      onClick={signInWithGoogle}
                      className="group relative flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-4 py-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900" 
                      type="button"
                    >
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-110">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                          </svg>
                        </div>
                      </span>
                      <span className="ml-6">Continue with Google</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              Trusted by forward-thinking hiring teams worldwide
            </p>
          </div>
        </main>

        <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-6 text-center sm:flex-row sm:justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 AI Recruiter. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary" href="#">Privacy Policy</a>
              <a className="text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary" href="#">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Login