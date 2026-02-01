import { PLAN, CREDITS } from './constants';

export const canCreateInterview = (user) => {
  if (!user) return false;
  
  // Paid plans have unlimited access
  if (user.subscription_plan === PLAN.MONTHLY || user.subscription_plan === PLAN.YEARLY) {
    return true;
  }
  
  // Starter Plan requires credits
  if (user.subscription_plan === PLAN.STARTER) {
    return (user.credits || 0) >= CREDITS.INTERVIEW_COST;
  }

  // Fallback for unknown plans (treat as restricted)
  return false;
};
