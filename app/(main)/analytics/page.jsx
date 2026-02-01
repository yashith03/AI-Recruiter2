"use client"

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Video, 
  CheckCircle, 
  Target, 
  Calendar,
  Download,
  MoreVertical,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import moment from 'moment'
import { downloadCSV } from '@/app/utils/export'

export default function AnalyticsPage() {
  const { user } = useUser()
  const [dateRange, setDateRange] = useState('Last 7 Days')
  const [loading, setLoading] = useState(true)
  
  // Stats State
  const [kpis, setKpis] = useState({
    totalCandidates: 0,
    interviewsCompleted: 0,
    avgScore: 0,
    offerRate: 0
  })

  // Chart Data State
  const [volumeData, setVolumeData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [recentEvaluations, setRecentEvaluations] = useState([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return

      try {
        setLoading(true)

        // 1. Fetch User Interviews (to get IDs and Job Positions)
        const { data: interviews, error: interviewError } = await supabase
          .from('interviews')
          .select('id, jobPosition, created_at')
          .eq('userEmail', user.email) 

        if (interviewError) throw interviewError
        
        const interviewIds = interviews.map(i => i.id)
        const jobPositionMap = interviews.reduce((acc, curr) => {
          acc[curr.id] = curr.jobPosition
          return acc
        }, {})

        if (interviewIds.length === 0) {
            setLoading(false)
            return // No data
        }

        // 2. Fetch Feedback for these interviews
        const { data: allFeedback, error: feedbackError } = await supabase
          .from('interview-feedback')
          .select('*')
          .in('interview_id', interviewIds) 

        if (feedbackError) throw feedbackError

        // --- FILTERING ---
        let feedback = allFeedback
        const now = moment()
        
        if (dateRange === 'Last 7 Days') {
          feedback = allFeedback.filter(f => moment(f.created_at).isAfter(moment().subtract(7, 'days')))
        } else if (dateRange === 'This Month') {
          feedback = allFeedback.filter(f => moment(f.created_at).isSame(now, 'month'))
        } else if (dateRange === 'This Year') {
          feedback = allFeedback.filter(f => moment(f.created_at).isSame(now, 'year'))
        }
        // 'All Time' -> no filter

        // --- CALCULATIONS ---

        // A. KPIs
        const totalCandidates = feedback.length
        
        // Count completed
        const completedCount = feedback.filter(f => f.rating !== null).length
        
        // Avg Score
        const validScores = feedback.filter(f => f.rating !== null).map(f => Number(f.rating))
        const avgScore = validScores.length > 0 
          ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1) 
          : 0

        // Offer Rate (Score >= 7.5)
        const offersByScore = validScores.filter(s => s >= 7.5).length
        const offerRate = totalCandidates > 0 
          ? ((offersByScore / totalCandidates) * 100).toFixed(1)
          : 0

        setKpis({
          totalCandidates,
          interviewsCompleted: completedCount,
          avgScore,
          offerRate
        })

        // B. Volume Data
        // For 'Last 7 Days', use specific days. For others, maybe specific grouping, 
        // but to keep UI simple, let's keep the 'Selected Period' volume distribution by day of week
        // or just aggregate by day if it's a longer period? 
        // The current chart expects "count" per "day". 
        // For simplicity in this iteration: map strictly to Day of Week for the filtered set.
        // (Improving this for 'Year' views to be 'Month' based is a future enhancement)
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const volumeMap = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 }

        feedback.forEach(item => {
           const dayName = days[new Date(item.created_at).getDay()]
           volumeMap[dayName]++
        })

        const chartData = [
          { day: 'Mon', count: volumeMap['Mon'] },
          { day: 'Tue', count: volumeMap['Tue'] },
          { day: 'Wed', count: volumeMap['Wed'] },
          { day: 'Thu', count: volumeMap['Thu'] },
          { day: 'Fri', count: volumeMap['Fri'] },
          { day: 'Sat', count: volumeMap['Sat'] },
          { day: 'Sun', count: volumeMap['Sun'] },
        ]
        setVolumeData(chartData)

        // C. Status Distribution
        let passed = 0, failed = 0, pending = 0
        feedback.forEach(item => {
           if (item.rating === null) {
             pending++
           } else {
             const score = Number(item.rating)
             if (score >= 7.5) {
               passed++
             } else if (score >= 4) {
               pending++
             } else {
               failed++
             }
           }
        })
        const totalStatus = passed + failed + pending
        
        setStatusData([
          { name: 'Passed', value: totalStatus ? Math.round((passed/totalStatus)*100) : 0, color: '#3b82f6' },
          { name: 'Pending', value: totalStatus ? Math.round((pending/totalStatus)*100) : 0, color: '#f97316' },
          { name: 'Failed', value: totalStatus ? Math.round((failed/totalStatus)*100) : 0, color: '#ef4444' },
        ])

        // D. Recent Evaluations
        const sortedFeedback = [...feedback].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8)
        
        const recentList = sortedFeedback.map(item => {
           let status = 'Pending'
           let colorClass = 'text-gray-500'
           
           if (item.rating !== null) {
              const r = Number(item.rating)
              if (r >= 7.5) { status = 'Passed'; colorClass = 'text-green-600' }
              else if (r >= 4) { status = 'Pending'; colorClass = 'text-orange-500' }
              else { status = 'Failed'; colorClass = 'text-red-500' }
           }

           return {
             name: item.userName || 'Unknown Candidate',
             role: jobPositionMap[item.interview_id] || 'Unknown Position',
             date: moment(item.created_at).format('MMM D, YYYY'),
             score: item.rating ? (Number(item.rating) * 10).toFixed(0) : '-',
             rawScore: item.rating,
             status: status,
             statusColor: colorClass
           }
        })
        setRecentEvaluations(recentList)

      } catch (err) {
        console.error("Error fetching analytics:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, dateRange])

  const handleExport = () => {
    // ... existing export logic
    if (recentEvaluations.length === 0) {
       toast.error("No data available to export")
       return
    }
    const reportData = recentEvaluations.map(item => ({
      Candidate: item.name,
      Role: item.role,
      Date: item.date,
      'AI Score': item.rawScore || 0,
      Status: item.status
    }));
    downloadCSV(reportData, `Recruitment_Report_${moment().format('YYYY-MM-DD')}.csv`);
    toast.success("Report downloaded successfully");
  }

  if (loading) {
     // ... existing loader
     return (
       <div className="flex h-[80vh] items-center justify-center">
         <Loader2 className="h-10 w-10 animate-spin text-primary" />
       </div>
     )
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-20 space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Overview</h1>
          <p className="text-muted-foreground mt-1">Detailed insights into your AI-driven recruitment pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="This Year">This Year</SelectItem>
              <SelectItem value="All Time">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleExport} className="bg-primary hover:bg-primary-dark text-primary-foreground">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Top Component Row - KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Candidates', value: kpis.totalCandidates, change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Interviews Completed', value: kpis.interviewsCompleted, change: '+5%', icon: Video, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg. AI Score', value: isNaN(kpis.avgScore) ? '-' : kpis.avgScore, change: '-2%', icon: Target, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Offer Rate', value: `${kpis.offerRate}%`, change: '+1.5%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between h-[160px]">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              {/* Mock trend for now as strictly historical data comparison is complex */}
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-600`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Candidate Volume (Area Chart) */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-foreground">Candidate Volume</h3>
                <p className="text-sm text-muted-foreground">Daily applications received</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">Selected Week</span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData} >
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                  />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* Right: Status Distribution (Pie Chart) */}
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-foreground">Status Distribution</h3>
              <p className="text-sm text-muted-foreground">Pipeline breakdown</p>
            </div>

            <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
               {/* Pie Chart */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               {/* Center Text */}
               <div className="absolute text-center z-10 pointer-events-none">
                  <span className="text-3xl font-bold text-foreground block">{kpis.totalCandidates}</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Total</span>
               </div>
            </div>

            <div className="space-y-3 mt-4">
              {statusData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
        </div>

      </div>

      {/* Recent Evaluations Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-border flex items-center justify-between">
           <div>
             <h3 className="text-lg font-bold text-foreground">Recent Evaluations</h3>
             <p className="text-sm text-muted-foreground">Real-time AI scoring and status updates</p>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr className="text-left">
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Candidate</th>
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Score</th>
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-6 text-xs font-bold text-muted-foreground uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentEvaluations.length === 0 ? (
                <tr>
                   <td colSpan={6} className="p-8 text-center text-muted-foreground">
                     No recent evaluations found.
                   </td>
                </tr>
              ) : recentEvaluations.map((row, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      {/* Avatar Placeholder using Initials */}
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-border">
                        {row.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{row.name}</p>
                        {/* Assuming we don't fetch email, so hiding or mocking if strictly needed */}
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-sm font-medium text-foreground">{row.role}</td>
                  <td className="p-6 text-sm text-muted-foreground">{row.date}</td>
                  <td className="p-6">
                    {row.rawScore ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                        ${Number(row.rawScore) >= 8 ? 'bg-green-100 text-green-700' : 
                          Number(row.rawScore) >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {row.score}/100
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                       <span className={`text-sm font-bold ${row.statusColor}`}>
                         {row.status}
                       </span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex justify-between items-center bg-muted/20">
            <span className="text-sm text-muted-foreground font-medium pl-2">
               Showing {recentEvaluations.length} results
            </span>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-9" disabled>Previous</Button>
                <Button variant="outline" size="sm" className="h-9" disabled>Next</Button>
            </div>
        </div>
      </div>

    </div>
  )
}
