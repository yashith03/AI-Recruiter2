import React from 'react'
import { Brain } from 'lucide-react'
import { useUser } from '@/app/provider'
import { cn } from '@/lib/utils'

const CreditBadge = ({ className }) => {
  const { user } = useUser()

  return (
    <div className={cn(
      "hidden sm:flex items-center gap-2 bg-slate-50 px-4 h-12 rounded-xl border border-slate-100",
      className
    )}>
      <Brain className="text-primary" size={18} />
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Available Credits</span>
        <span className="text-body font-black text-slate-900 font-mono leading-none justify-center text-center">
          {user?.credits || 0}
        </span>
      </div>
    </div>
  )
}

export default CreditBadge
