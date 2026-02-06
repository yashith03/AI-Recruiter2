import { supabase } from '../supabaseClient';

/**
 * Fetch all interviews for a user
 */
export const fetchAllInterviews = async (email) => {
  const { data, error } = await supabase
    .from('interviews')
    .select('*, interview-feedback!interview_feedback_interview_id_fk(*)')
    .eq('userEmail', email)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
};

/**
 * Fetch scheduled interviews (not completed)
 */
export const fetchScheduledInterviews = async (email) => {
  const { data, error } = await supabase
    .from('interviews')
    .select('*, interview-feedback!interview_feedback_interview_id_fk(*)')
    .eq('userEmail', email)
    .in('status', ['scheduled', 'in_progress', 'cancelled'])
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Filter out interviews where any candidate has reached 'ready' (completed) status
  const filtered = (data || []).filter(interview => {
    const feedbacks = interview['interview-feedback'] || [];
    return !feedbacks.some(fb => fb.summary_status === 'ready');
  });

  return filtered;
};

/**
 * Fetch completed interviews (has feedback with 'ready' status)
 */
export const fetchCompletedInterviews = async (email) => {
  const { data, error } = await supabase
    .from('interviews')
    .select('*, interview-feedback!interview_feedback_interview_id_fk!inner(*)')
    .eq('userEmail', email)
    .order('created_at', { ascending: false });

  if (error) {
    // If no records found, return empty array
    console.error('Supabase error:', error.message);
    return [];
  }

  return data ?? [];
};

/**
 * Fetch latest 3 interviews for dashboard
 */
export const fetchLatestInterviews = async (email) => {
  const { data, error } = await supabase
    .from('interviews')
    .select('*, interview-feedback!interview_feedback_interview_id_fk(*)')
    .eq('userEmail', email)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) throw error;
  return data ?? [];
};
