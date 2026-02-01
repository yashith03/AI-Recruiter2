import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const PageHeader = ({ title, subtitle, showBack = false, actions, className }) => {
  const router = useRouter()

  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6", className)}>
      <div className="flex items-center gap-4">
        {showBack && (
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div>
          <h1 className="text-h1 text-slate-900 mb-1">{title}</h1>
          {subtitle && <p className="text-body text-slate-500 font-medium">{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-4">
          {actions}
        </div>
      )}
    </div>
  )
}

export default PageHeader
