import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types'

interface AuthState {
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<{ error: string | null }>
  register: (
    name: string,
    phone: string,
    email: string,
    password: string
  ) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  updateProfile: (
    data: Partial<Pick<Profile, 'name' | 'email' | 'address' | 'settings'>>
  ) => Promise<{ error: string | null }>
  fetchProfile: (userId: string) => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    set({ session })

    if (session?.user) {
      await get().fetchProfile(session.user.id)
    }

    supabase.auth.onAuthStateChange(async (_, newSession) => {
      set({ session: newSession })
      if (newSession?.user) {
        await get().fetchProfile(newSession.user.id)
      } else {
        set({ profile: null })
      }
    })

    set({ isInitialized: true })
  },

  login: async (email, password) => {
    set({ isLoading: true })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    set({ isLoading: false })
    if (error) return { error: 'Nomor atau password salah' }
    return { error: null }
  },

  register: async (name, phone, email, password) => {
    set({ isLoading: true })

    // Cek apakah nomor telepon sudah terdaftar
    const { data: existingPhone } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', phone)
      .maybeSingle()

    if (existingPhone) {
      set({ isLoading: false })
      return { error: 'Nomor sudah terdaftar' }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    })

    if (error) {
      set({ isLoading: false })
      if (error.message.toLowerCase().includes('already registered')) {
        return { error: 'Email sudah terdaftar' }
      }
      return { error: 'Gagal membuat akun, coba lagi' }
    }

    // Profile auto-dibuat via trigger handle_new_user.
    // Update phone & name jika trigger sudah berjalan.
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ phone, name })
        .eq('id', data.user.id)
    }

    set({ isLoading: false })
    return { error: null }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ session: null, profile: null })
  },

  updateProfile: async (data) => {
    const session = get().session
    if (!session) return { error: 'Sesi tidak valid' }

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', session.user.id)

    if (error) return { error: 'Gagal menyimpan perubahan' }

    await get().fetchProfile(session.user.id)
    return { error: null }
  },

  fetchProfile: async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) set({ profile: data as Profile })
  },
}))
