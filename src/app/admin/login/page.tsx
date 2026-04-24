'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
    } else {
      // Check if approved
      const { data: profile } = await supabase.from('profiles').select('status').single();
      if (profile?.status !== 'approved') {
        setMessage('Your account has not been approved yet.')
        await supabase.auth.signOut()
        setLoading(false)
      } else {
        router.push('/admin')
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Sign in to manage the menu.</p>
        <form onSubmit={handleLogin} className={styles.form}>
          <label className={styles.label}>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
          </label>
          <label className={styles.label}>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
          </label>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
        <p className={styles.linkText}>
          Don't have an account? <a href="/admin/signup">Request access</a>
        </p>
      </div>
    </div>
  )
}
