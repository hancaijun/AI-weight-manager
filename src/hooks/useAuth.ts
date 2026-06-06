import { useState, useEffect, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  // Initialize: check existing session
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setState((s) => ({ ...s, loading: false }))
      return
    }

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: error?.message ?? null,
      })
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase 未配置，请先创建项目并设置环境变量' }
    }
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: translateError(error.message) }
    // Auto-create profile on signup
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        created_at: new Date().toISOString(),
      })
    }
    return { error: null }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase 未配置，请先创建项目并设置环境变量' }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: translateError(error.message) }
    // Load user data after login
    if (data.user) {
      await loadUserData(data.user.id)
    }
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const loadUserData = useCallback(async (userId: string) => {
    // Load profile and latest plan from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    const { data: plans } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)

    return { profile, latestPlan: plans?.[0] ?? null }
  }, [])

  return { ...state, signUp, signIn, signOut, loadUserData, isConfigured: isSupabaseConfigured() }
}

function translateError(message: string): string {
  if (message.includes('Invalid login credentials')) return '邮箱或密码错误'
  if (message.includes('already registered')) return '该邮箱已注册，请直接登录'
  if (message.includes('Password should be at least 6')) return '密码至少需要6位'
  if (message.includes('Email rate limit exceeded')) return '请求太频繁，请稍后再试'
  if (message.includes('Email not confirmed')) return '请先验证邮箱（检查收件箱）'
  return message
}
