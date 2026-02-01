import React from 'react'
import { cn } from '@/lib/utils'

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-20 px-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-center animate-in fade-in duration-500",
      className
    )}>
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 mb-8 shadow-sm ring-4 ring-slate-50/50">
        {Icon && <Icon size={40} strokeWidth={1.5} />}
      </div>
      <h3 className="text-h1 text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-body-lg text-slate-500 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState
