'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  CheckCheck, 
  Calendar, 
  Bot, 
  UserPlus, 
  AlertTriangle, 
  ClipboardList,
  ChevronRight,
  MoreVertical,
  Loader2
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/app/provider'
import { fetchNotifications } from '@/services/queries/notifications'
import { supabase } from '@/services/supabaseClient'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const { user, isAuthLoading } = useUser()
  const queryClient = useQueryClient()

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: () => fetchNotifications(user.email),
    enabled: !!user?.email && !isAuthLoading,
  })

  // Set icons after fetching (since they can't be serialized)
  const notificationsWithIcons = notifications.map(n => ({
    ...n,
    icon: ClipboardList,
    actionIcon: ChevronRight,
  }))

  const unreadCount = notificationsWithIcons.filter(n => n.isUnread).length

  const filteredNotifications = activeTab === 'unread' 
    ? notificationsWithIcons.filter(n => n.isUnread)
    : notificationsWithIcons

  const groupedNotifications = filteredNotifications.reduce((acc, curr) => {
    if (!acc[curr.group]) acc[curr.group] = []
    acc[curr.group].push(curr)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-h1 text-foreground mb-2">Notifications</h1>
            <p className="text-body text-muted-foreground">Stay updated on your hiring pipeline</p>
          </div>
          <Button 
            variant="outline" 
            onClick={async () => {
              if (!user?.email) return
              const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_email', user.email)
                .eq('is_read', false)
              
              if (!error) {
                queryClient.invalidateQueries({ queryKey: ['notifications', user?.email] })
                toast.success('All notifications marked as read')
              } else {
                toast.error('Failed to mark notifications as read')
              }
            }}
            className="text-body font-bold border-border h-10 px-4 gap-2 text-muted-foreground hover:text-foreground"
          >
            <CheckCheck size={18} />
            Mark all as read
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-8">
            {[
              { id: 'all', label: 'All Notifications' },
              { id: 'unread', label: 'Unread', count: unreadCount }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-body font-bold transition-all relative ${
                  activeTab === tab.id 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {tab.count}
                    </span>
                  )}
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {isLoading ? (
             <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border shadow-sm p-5 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-slate-50 shrink-0 h-12 w-12 animate-pulse" />
                    <div className="flex-1 space-y-2">
                       <div className="flex items-center gap-2">
                          <div className="h-5 w-48 bg-slate-100 rounded animate-pulse" />
                          <div className="h-2 w-2 rounded-full bg-slate-100 animate-pulse" />
                       </div>
                       <div className="h-4 w-full max-w-lg bg-slate-50 rounded animate-pulse" />
                       <div className="h-3 w-24 bg-slate-50 rounded animate-pulse pt-1" />
                    </div>
                    <div className="hidden md:block">
                       <div className="h-9 w-32 bg-slate-50 rounded-xl animate-pulse" />
                    </div>
                  </div>
                ))}
             </div>
          ) : Object.keys(groupedNotifications).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <Bot size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-h3 text-slate-800">No Notifications</h3>
                <p className="text-body text-slate-500 max-w-xs mx-auto mt-1">
                  When candidates complete interviews or when AI finishes screening, you&apos;ll see them here.
                </p>
              </div>
            </div>
          ) : (
            Object.entries(groupedNotifications).map(([group, items]) => (
              <div key={group} className="space-y-4">
                <h2 className="text-h3 text-foreground font-bold">{group}</h2>
                <div className="space-y-3">
                  {items.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`group relative bg-card rounded-2xl border border-border shadow-sm p-5 transition-all hover:border-primary/20 hover:shadow-md ${
                        notification.isUnread ? 'border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`p-3 rounded-xl ${notification.iconBg}`}>
                          <notification.icon className={`size-6 ${notification.iconColor}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-body font-bold text-foreground">
                              {notification.title}
                            </h3>
                            {notification.isUnread && (
                              <div className="size-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-body text-muted-foreground leading-relaxed md:max-w-2xl">
                            {notification.description}
                          </p>
                          <p className="text-label text-muted-foreground pt-1">
                            {notification.time}
                          </p>
                        </div>

                        {/* Action */}
                        <div className="hidden md:block">
                          {notification.link ? (
                            <Link href={notification.link}>
                              <Button 
                                variant="ghost"
                                className="text-primary hover:text-primary-dark hover:bg-primary/5 gap-1.5 font-bold h-9 px-4"
                              >
                                {notification.actionLabel}
                                {notification.actionIcon && <notification.actionIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />}
                              </Button>
                            </Link>
                          ) : notification.actionLabel ? (
                            <Button 
                              variant="outline"
                              className="text-label font-bold h-9 px-4 border-border text-foreground hover:bg-muted"
                            >
                              {notification.actionLabel}
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
                              <MoreVertical size={18} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
