create or replace function decrement_credits(user_email text, credit_cost int)
returns boolean
language plpgsql
security definer
as $$
declare
  current_credits int;
  current_plan text;
begin
  -- Lock the row for update to prevent race conditions
  select credits, subscription_plan 
  into current_credits, current_plan
  from users
  where email = user_email
  for update;

  -- Guard against missing user
  if not found then
    return false;
  end if;

  -- 1. If Paid Plan (Monthly/Yearly), allow without decrement
  if current_plan in ('Monthly', 'Yearly') then
    return true;
  end if;

  -- 2. If Starter Plan, check credits
  if current_credits >= credit_cost then
    update users
    set credits = credits - credit_cost
    where email = user_email;
    return true;
  else
    return false;
  end if;
end;
$$;
