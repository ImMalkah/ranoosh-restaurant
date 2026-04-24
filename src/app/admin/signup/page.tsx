'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Signup successful. Waiting for admin approval.')
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Signup</h1>
        <p className={styles.subtitle}>Request access to the CMS.</p>
        <form onSubmit={handleSignup} className={styles.form}>
          <label className={styles.label}>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input} />
          </label>
          <label className={styles.label}>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
          </label>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
        <p className={styles.linkText}>
          Already have an account? <a href="/admin/login">Log in</a>
        </p>
      </div>
    </div>
  )
}
