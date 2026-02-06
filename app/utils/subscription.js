import { PLAN, CREDITS } from './constants';

export const canCreateInterview = (user) => {
  if (!user) return false;

  const userPlan = (user.subscription_plan || PLAN.STARTER).toLowerCase();
  
  // Paid plans have unlimited access
  if (userPlan === PLAN.MONTHLY.toLowerCase() || userPlan === PLAN.YEARLY.toLowerCase()) {
    return true;
  }
  
  // All other plans (Starter, Credit Pack, etc.) require credits
  return (user.credits || 0) >= CREDITS.INTERVIEW_COST;
};
