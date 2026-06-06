import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase 未配置。请在项目根目录创建 .env 文件，填入 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY。\n' +
    '获取方式：在 supabase.com 创建项目 → Settings → API'
  )
}

// Create a dummy client when not configured to avoid crashes
const dummyUrl = 'https://placeholder.supabase.co'
const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

export const supabase = createClient(
  supabaseUrl || dummyUrl,
  supabaseAnonKey || dummyKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
)

export const isSupabaseConfigured = () => !!(supabaseUrl && supabaseAnonKey)
