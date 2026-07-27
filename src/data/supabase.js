// Supabase client with production fallback credentials
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://pbfhgpitghiwkelhzssz.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9UC-fIvJNypRa6oIpZBXlw_dHpB9OUm'

export const supabase = url && key ? createClient(url, key) : null
