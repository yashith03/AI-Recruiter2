"use client"
import React from 'react'
import { Plus, Phone, LineChart, ArrowRight, Video } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function CreateOptions() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {/* Create New Interview Card */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-8 shadow-xl shadow-blue-200 hover:shadow-2xl transition-all animate-in zoom-in duration-500">
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

        {/* Phone Screening Card */}
        <Link href='/dashboard/phone-screening' className="block translate-y-0 hover:-translate-y-1 transition-transform">
            <div className="bg-white h-full rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col gap-6">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <Phone size={24} />
                </div>
                
                <div className="flex-1">
                    <h2 className='text-h2 text-slate-800 mb-2'>Phone Screening</h2>
                    <p className='text-body text-slate-500'>
                        Configure a quick automated phone screen to filter candidates before the main interview.
                    </p>
                </div>

                <Button variant="outline" className="w-full border-purple-100 text-purple-600 hover:bg-purple-50 font-bold h-12 rounded-xl group/btn">
                    Create Call <Plus size={18} className="ml-1 group-hover/btn:rotate-90 transition-transform" />
                </Button>
            </div>
        </Link>

        {/* Pipeline Overview Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group animate-in zoom-in duration-500 delay-200">
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
                    { label: 'Active Interviews', value: '12', color: 'bg-green-500' },
                    { label: 'Pending Reviews', value: '5', color: 'bg-orange-500' },
                    { label: 'Candidates This Week', value: '28', color: 'bg-blue-600' }
                ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                            <span className="text-body text-slate-500 group-hover/item:text-slate-900 transition-colors">
                                {stat.label}
                            </span>
                        </div>
                        <span className="text-h3 text-slate-900">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
                <button className="text-primary text-body font-bold flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4">
                    View Full Analytics <ArrowRight size={14} className="-rotate-45" />
                </button>
            </div>
        </div>
    </div>
  )
}

export default CreateOptions