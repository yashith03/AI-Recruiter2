// app/(main)/dashboard/_components/CreateOptions.jsx

"use client"
import React, { useEffect, useState } from 'react'
import { Plus, LineChart, ArrowRight, Video } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import moment from 'moment'

function CreateOptions() {
  const { user } = useUser()
  const [metrics, setMetrics] = useState({
    activeInterviews: 0,
    pendingReviews: 0,
    candidatesWeek: 0,
    loading: true
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return

      try {
        // 1. Active Interviews
        const { count: interviewCount } = await supabase
          .from('interviews')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', user.email)

        // 2. Candidates This Week
        const weekAgo = moment().subtract(7, 'days').toISOString()
        const { count: distinctCandidates } = await supabase
          .from('interview-feedback')
          .select('interviews!inner(created_by)', { count: 'exact', head: true })
          .eq('interviews.created_by', user.email)
          .gte('created_at', weekAgo)

        // 3. Pending Reviews
        const { count: pendingCount } = await supabase
          .from('interview-feedback')
          .select('interviews!inner(created_by)', { count: 'exact', head: true })
          .eq('interviews.created_by', user.email)
          .is('rating', null) 

        setMetrics({
          activeInterviews: interviewCount || 0,
          pendingReviews: pendingCount || 0, 
          candidatesWeek: distinctCandidates || 0,
          loading: false
        })
      } catch (error) {
        console.error("Error fetching pipeline metrics:", error)
        setMetrics(prev => ({ ...prev, loading: false }))
      }
    }

    fetchMetrics()
  }, [user])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {/* Create New Interview Card */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-8 shadow-xl shadow-blue-200 hover:shadow-2xl transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 -rotate-12 transform scale-150">
                <Video size={120} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
                    <Plus size={24} />
                </div>
                
                <div>
                    <h2 className='text-h2 text-white mb-2'>Create New Interview</h2>
                    <p className='text-body text-blue-50 opacity-90'>
                        Set up a new AI-driven interview session tailored to specific job roles and requirements.
                    </p>
                </div>
                
                <Link href='/dashboard/create-interview'>
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold h-12 rounded-xl shadow-lg shadow-blue-700/20 group/btn">
                        Get Started <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>



        {/* Pipeline Overview Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <LineChart size={20} />
                    </div>
                    <h2 className='text-h3 text-slate-800'>Pipeline Overview</h2>
                </div>
            </div>

            <div className="space-y-6">
                {[
                    { label: 'Completed interviews', value: metrics.activeInterviews, color: 'bg-green-500' },
                    { label: 'Ongoing interviews', value: metrics.pendingReviews, color: 'bg-orange-500' },
                    { label: 'Candidates This Week', value: metrics.candidatesWeek, color: 'bg-blue-600' }
                ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                            <span className="text-body text-slate-500 group-hover/item:text-slate-900 transition-colors">
                                {stat.label}
                            </span>
                        </div>
                        <span className="text-h3 text-slate-900">
                           {metrics.loading ? "-" : stat.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
                <Link href="/analytics">
                    <button className="text-primary text-body font-bold flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4">
                        View Full Analytics <ArrowRight size={14} className="-rotate-45" />
                    </button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default CreateOptions