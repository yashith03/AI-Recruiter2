import { supabase } from '../supabaseClient';
import moment from 'moment';

/**
 * Fetch analytics data for a user
 */
export const fetchAnalyticsInterviews = async (email) => {
  const { data, error } = await supabase
    .from('interviews')
    .select('id, jobPosition, created_at')
    .eq('userEmail', email);

  if (error) throw error;
  return data ?? [];
};

/**
 * Fetch analytics feedback data
 */
export const fetchAnalyticsFeedback = async (interviewIds) => {
  if (interviewIds.length === 0) return [];

  const { data, error } = await supabase
    .from('interview-feedback')
    .select('*')
    .in('interview_id', interviewIds);

  if (error) throw error;
  return data ?? [];
};
