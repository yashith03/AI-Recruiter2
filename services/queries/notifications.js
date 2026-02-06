import { supabase } from '../supabaseClient';
import moment from 'moment';

/**
 * Fetch notifications for a user
 */
export const fetchNotifications = async (email) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map the database records to the UI notification format
  const mappedNotifications = (data || []).map(item => {
    const createdAt = moment(item.created_at);
    let group = 'Earlier this week';
    if (createdAt.isSame(moment(), 'day')) group = 'Today';
    else if (createdAt.isSame(moment().subtract(1, 'days'), 'day')) group = 'Yesterday';

    return {
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.message,
      time: createdAt.fromNow(),
      isUnread: !item.is_read,
      group: group,
      icon: null, // Will be set by component
      iconColor: 'text-primary',
      iconBg: 'bg-primary/5',
      actionLabel: 'Show feedback',
      actionIcon: null, // Will be set by component
      link: item.link
    };
  });

  return mappedNotifications;
};
