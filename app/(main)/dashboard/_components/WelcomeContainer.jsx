// app/(main)/dashboard/_components/WelcomeContainer.jsx

"use client"
import React from 'react'
import { useUser } from '@/app/provider';
import { Calendar as CalendarIcon } from 'lucide-react';
import moment from 'moment';

function WelcomeContainer() {
    const { user } = useUser();
    
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 mt-5">
            <div>
                <h1 className="text-h1 text-slate-900 mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className="text-body-lg text-slate-500">
                    Here&apos;s what&apos;s happening with your recruitment pipeline today.
                </p>
            </div>
            
            <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <CalendarIcon className="text-slate-400 group-hover:text-primary transition-colors" size={18} />
                <span className="text-body font-bold text-slate-700">
                    {moment().format('MMM DD, YYYY')}
                </span>
            </div>
        </div>
    )
}

export default WelcomeContainer