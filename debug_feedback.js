
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFeedback() {
  const interview_id = '7a1e17f0-eae6-4828-a022-5473f442efa8';
  console.log('Checking feedback for ID:', interview_id);
  
  const { data, error } = await supabase
    .from('interview-feedback')
    .select('*')
    .eq('interview_id', interview_id);
    
  if (error) {
    console.error('Error fetching feedback:', error);
  } else {
    console.log('Feedback Rows Found:', data.length);
    if (data.length > 0) {
      console.log('First Row:', JSON.stringify(data[0], null, 2));
    }
  }
}

checkFeedback();
