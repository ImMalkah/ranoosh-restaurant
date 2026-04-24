'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('menu')
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  // Form state
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // Check session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }

    const [itemsRes, catsRes, profsRes] = await Promise.all([
      supabase.from('menu_items').select('*').order('category_id').order('order_index'),
      supabase.from('menu_categories').select('*').order('order_index'),
      supabase.from('profiles').select('*').order('created_at', { ascending: false })
    ])

    if (itemsRes.data) setItems(itemsRes.data)
    if (catsRes.data) {
      setCategories(catsRes.data)
      if (catsRes.data.length > 0) setCategoryId(catsRes.data[0].id)
    }
    if (profsRes.data) setProfiles(profsRes.data)
      
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleApproveUser = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'denied' : 'approved'
    const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', id)
    if (!error) fetchData()
  }

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await supabase.from('menu_items').delete().eq('id', id)
      fetchData()
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? All items in this category will also be deleted!')) {
      await supabase.from('menu_categories').delete().eq('id', id)
      fetchData()
    }
  }

  const openAddModal = () => {
    setEditingItem(null)
    setTitle('')
    setPrice('')
    setDescription('')
    if (categories.length > 0) setCategoryId(categories[0].id)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setShowModal(true)
  }

  const openEditModal = (item: any) => {
    setEditingItem(item)
    setTitle(item.title)
    setPrice(item.price)
    setDescription(item.description || '')
    setCategoryId(item.category_id)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setShowModal(true)
  }

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    let imageUrl = editingItem ? editingItem.image_url : null

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('menu_images')
        .upload(fileName, imageFile)

      if (uploadError) {
        console.error('Error uploading image', uploadError)
        alert('Failed to upload image')
        setIsSaving(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage.from('menu_images').getPublicUrl(fileName)
      imageUrl = publicUrl
    }

    const payload = {
      title,
      price,
      description,
      category_id: categoryId,
      image_url: imageUrl
    }

    if (editingItem) {
      await supabase.from('menu_items').update(payload).eq('id', editingItem.id)
    } else {
      await supabase.from('menu_items').insert(payload)
    }

    setShowModal(false)
    setIsSaving(false)
    fetchData()
  }

  if (loading) return <div className={styles.container}>Loading dashboard...</div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </header>

      <div className={styles.tabs}>
        <button className={activeTab === 'menu' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('menu')}>Menu Items</button>
        <button className={activeTab === 'categories' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('categories')}>Categories</button>
        <button className={activeTab === 'users' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('users')}>Access Requests</button>
      </div>

      <div className={styles.content}>
        {activeTab === 'users' && (
          <div className={styles.section}>
            <h2>Access Requests</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id}>
                    <td>{p.email}</td>
                    <td><span className={styles['badge-' + p.status]}>{p.status}</span></td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleApproveUser(p.id, p.status)} className={styles.actionBtn}>
                        {p.status === 'approved' ? 'Revoke Access' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Menu Items</h2>
              <button className={styles.primaryBtn} onClick={openAddModal}>+ Add New Item</button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const cat = categories.find(c => c.id === item.category_id)
                  return (
                    <tr key={item.id}>
                      <td>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className={styles.thumb} />
                        ) : 'No image'}
                      </td>
                      <td>{item.title}</td>
                      <td>{item.price}</td>
                      <td>{cat?.name}</td>
                      <td>
                        <button className={styles.actionBtn} onClick={() => openEditModal(item)}>Edit</button>
                        <button className={styles.dangerBtn} onClick={() => handleDeleteItem(item.id)}>Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className={styles.section}>
            <h2>Categories</h2>
            <ul className={styles.list}>
              {categories.map(c => (
                <li key={c.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{c.name}</span>
                  <button className={styles.dangerBtn} onClick={() => handleDeleteCategory(c.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{editingItem ? 'Edit Menu Item' : 'Add New Item'}</h3>
            <form onSubmit={handleSaveItem} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label>Price</label>
                <input type="text" value={price} onChange={e => setPrice(e.target.value)} required placeholder="$0.00" />
              </div>
              <div className={styles.formGroup}>
                <label>Description (Optional)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Photo</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} ref={fileInputRef} />
                {editingItem?.image_url && !imageFile && (
                  <p className={styles.helpText}>Current image: <img src={editingItem.image_url} alt="Current" className={styles.thumb} style={{verticalAlign: 'middle', marginLeft: '10px'}} /></p>
                )}
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={isSaving} className={styles.primaryBtn}>{isSaving ? 'Saving...' : 'Save Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
