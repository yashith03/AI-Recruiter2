// app/(main)/all-phone-screenings/page.jsx

"use client"
import React, { useState } from 'react'
import { 
  Search, 
  Phone, 
  Filter, 
  Calendar, 
  MoreVertical, 
  Copy, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Play,
  FileEdit,
  ExternalLink,
  ChevronDown,
  Clock,
  ListFilter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

const ScreenCard = ({ screen }) => {
  const isDraft = screen.status === 'DRAFT';
  const isPaused = screen.status === 'PAUSED';
  const isActive = screen.status === 'ACTIVE';

  const getStatusColor = () => {
    if (isActive) return 'bg-green-500';
    if (isPaused) return 'bg-slate-400';
    if (isDraft) return 'bg-amber-400';
    return 'bg-slate-200';
  };

  const getBadgeColor = () => {
    if (isActive) return 'bg-green-100 text-green-600';
    if (isPaused) return 'bg-slate-100 text-slate-500';
    if (isDraft) return 'bg-amber-100 text-amber-600';
    return 'bg-slate-100 text-slate-500';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
      {/* Top Status Bar */}
      <div className={`h-1.5 w-full ${getStatusColor()}`} />
      
      <div className="p-8 pb-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${getBadgeColor()}`}>
            {screen.status}
          </span>
          <button className="text-slate-300 hover:text-slate-600 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>

        <h3 className="text-h3 text-slate-900 mb-3 group-hover:text-primary transition-colors">
          {screen.title}
        </h3>

        <div className="flex items-center gap-5 text-helper text-slate-400 mb-8">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-300" />
            {screen.duration}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-300" />
            {screen.date}
          </div>
        </div>

        {isDraft ? (
          <div className="flex-1 flex items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-100 min-h-[100px] mb-6">
            <p className="text-body text-slate-400 italic font-bold uppercase tracking-widest">No candidates yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 mb-8">
            {Object.entries(screen.stats).map(([label, value]) => (
              <div key={label} className="text-center group/stat">
                <div className="text-h2 text-slate-800 leading-none mb-1 group-hover/stat:text-primary transition-colors">
                  {value}
                </div>
                <div className="text-label text-slate-400">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          {isDraft ? (
            <>
              <Button variant="outline" className="rounded-xl border-slate-100 text-slate-600 text-body font-bold h-11 gap-2 hover:bg-slate-50">
                <FileEdit size={14} /> Edit Draft
              </Button>
              <Button className="rounded-xl bg-slate-900 hover:bg-black text-white text-body font-bold h-11">
                Publish
              </Button>
            </>
          ) : isPaused ? (
            <>
              <Button variant="outline" className="rounded-xl border-slate-100 text-slate-600 text-body font-bold h-11 gap-2 hover:bg-slate-50">
                <Play size={14} /> Resume
              </Button>
              <Button variant="outline" className="rounded-xl border-slate-100 text-slate-600 text-body font-bold h-11">
                Results
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="rounded-xl border-slate-100 text-slate-600 text-body font-bold h-11 gap-2 hover:bg-slate-50 text-nowrap">
                <Copy size={14} /> Copy Link
              </Button>
              <Button className="rounded-xl bg-primary hover:bg-primary-dark text-white text-body font-bold h-11 text-nowrap">
                View Results
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AllPhoneScreenings() {
  const [screens] = useState([
    { title: 'Senior Frontend Developer', status: 'ACTIVE', duration: '15 mins', date: 'Oct 12, 2023', stats: { total: 12, passed: 4, failed: 2, pending: 6 } },
    { title: 'Sales Representative - Outbound', status: 'ACTIVE', duration: '20 mins', date: 'Oct 10, 2023', stats: { total: 48, passed: 15, failed: 8, pending: 25 } },
    { title: 'Product Designer', status: 'PAUSED', duration: '30 mins', date: 'Sep 28, 2023', stats: { total: 8, passed: 2, failed: 6, pending: 0 } },
    { title: 'Marketing Manager', status: 'ACTIVE', duration: '25 mins', date: 'Oct 05, 2023', stats: { total: 32, passed: 10, failed: 5, pending: 17 } },
    { title: 'Customer Support Specialist', status: 'DRAFT', duration: '15 mins', date: 'Today', stats: { total: 0, passed: 0, failed: 0, pending: 0 } },
    { title: 'DevOps Engineer', status: 'ACTIVE', duration: '45 mins', date: 'Oct 01, 2023', stats: { total: 5, passed: 1, failed: 0, pending: 4 } }
  ])

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-5">
        <div>
          <h1 className="text-h1 text-slate-900 mb-2">All Phone Screenings</h1>
          <p className="text-body-lg text-slate-500 font-bold opacity-80">Manage, track, and create new AI phone screens for your candidates.</p>
        </div>
        <Link href="/dashboard/phone-screening">
          <Button className="bg-primary hover:bg-primary-dark text-white text-body font-black h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 gap-3 transition-all active:scale-95">
            <Plus size={22} className="stroke-[3]" /> Create New Phone Screen
          </Button>
        </Link>
      </div>

      {/* Modern Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-4 items-center animate-in slide-in-from-top duration-700 delay-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            placeholder="Search by name, role, or keywords..." 
            className="pl-12 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-primary h-14 text-body font-semibold text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <Select>
            <SelectTrigger className="w-[160px] rounded-2xl border-slate-100 bg-white h-14 text-slate-700 text-body font-bold shadow-sm">
              <div className="flex items-center gap-2">
                <ListFilter size={16} className="text-slate-400" />
                <SelectValue placeholder="Status: All" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[200px] rounded-2xl border-slate-100 bg-white h-14 text-slate-700 text-body font-bold shadow-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                <SelectValue placeholder="Date: Last 30 Days" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[160px] rounded-2xl border-slate-100 bg-white h-14 text-slate-700 text-body font-bold shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                   <Plus size={10} className="text-slate-400" />
                </div>
                <SelectValue placeholder="Role: All" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" className="text-slate-400 hover:text-red-500 text-helper font-black uppercase tracking-widest px-4">
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom duration-1000 delay-200">
        {screens.map((screen, i) => (
          <ScreenCard key={i} screen={screen} />
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-slate-100">
        <p className="text-label text-slate-400">
          Showing <span className="text-slate-900">1-6</span> of <span className="text-slate-900">24</span> screens
        </p>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-xl h-11 w-11 border-slate-100 text-slate-300" disabled>
            <ChevronLeft size={20} />
          </Button>
          <Button className="rounded-xl h-11 w-11 bg-primary text-white text-body font-black shadow-lg shadow-primary/20 transition-all active:scale-90">1</Button>
          <Button variant="ghost" className="rounded-xl h-11 w-11 text-slate-500 text-body font-black hover:bg-slate-100 transition-all active:scale-90">2</Button>
          <Button variant="ghost" className="rounded-xl h-11 w-11 text-slate-500 text-body font-black hover:bg-slate-100 transition-all active:scale-90">3</Button>
          <span className="text-slate-200 px-2 font-black">...</span>
          <Button variant="outline" size="icon" className="rounded-xl h-11 w-11 border-slate-100 text-slate-600 hover:border-primary hover:text-primary transition-all active:scale-90">
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}
