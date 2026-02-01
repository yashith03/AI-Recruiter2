'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
import { supabase } from '@/services/supabaseClient'
import { useUser } from '@/app/provider'
import moment from 'moment'
import Link from 'next/link'

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  const fetchNotifications = useCallback(async () => {
    if (!user?.email) return
    setLoading(true)

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notifications:', error)
      setLoading(false)
      return
    }

    // Map the database records to the UI notification format
    const mappedNotifications = data.map(item => {
      const createdAt = moment(item.created_at)
      let group = 'Earlier this week'
      if (createdAt.isSame(moment(), 'day')) group = 'Today'
      else if (createdAt.isSame(moment().subtract(1, 'days'), 'day')) group = 'Yesterday'

      return {
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.message,
        time: createdAt.fromNow(),
        isUnread: !item.is_read,
        group: group,
        icon: ClipboardList,
        iconColor: 'text-primary',
        iconBg: 'bg-primary/5',
        actionLabel: 'Show feedback',
        actionIcon: ChevronRight,
        link: item.link
      }
    })

    setNotifications(mappedNotifications)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const unreadCount = notifications.filter(n => n.isUnread).length

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => n.isUnread)
    : notifications

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
                setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })))
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

        {/* Notification List */}
        <div className="space-y-10">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-slate-500 font-medium">Loading notifications...</p>
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
