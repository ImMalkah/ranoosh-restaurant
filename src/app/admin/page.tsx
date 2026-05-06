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
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  
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
  const [addons, setAddons] = useState<{id?: string, title: string, price: string}[]>([])
  
  const [cateringItems, setCateringItems] = useState<any[]>([])
  const [cateringCategories, setCateringCategories] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [modalType, setModalType] = useState('menu')
  
  const [currentHeroImage, setCurrentHeroImage] = useState<string>('/hero-bg.png')
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)
  const [isSavingHero, setIsSavingHero] = useState(false)
  
  const [navbarLogo, setNavbarLogo] = useState<string>('')
  const [navbarLogoFile, setNavbarLogoFile] = useState<File | null>(null)
  const [isSavingLogo, setIsSavingLogo] = useState(false)
  
  const [cateringHeroImage, setCateringHeroImage] = useState<string>('/catering-hero.jpg')
  const [cateringVideo, setCateringVideo] = useState<string>('/catering-video.mp4')
  const [cateringText, setCateringText] = useState<string>("Whether it's a family gathering, wedding, or corporate event, we prepare fresh, flavorful dishes that bring people together. Enjoy the taste of tradition with every bite.")
  const [cateringArabicText, setCateringArabicText] = useState<string>("مستعدون لتجهيز جميع المناسبات\nأكلات عراقية أصيلة، منسف القوزي و الدولمة والتبولة إلى المشاوي وطبعا المسكوف العراقي والأطباق الرئيسية\nللطلب والاستفسار: تواصل ويانا")
  const [cateringHeroFile, setCateringHeroFile] = useState<File | null>(null)
  const [cateringVideoFile, setCateringVideoFile] = useState<File | null>(null)
  const [isSavingCateringSettings, setIsSavingCateringSettings] = useState(false)
  
  const [newMenuCategory, setNewMenuCategory] = useState('')
  const [newCateringCategory, setNewCateringCategory] = useState('')
  
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [newModalCategoryName, setNewModalCategoryName] = useState('')
  
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

    const [itemsRes, catsRes, profsRes, settingsRes, cateringItemsRes, cateringCatsRes, inquiriesRes] = await Promise.all([
      supabase.from('menu_items').select('*, menu_item_addons(*)').order('category_id').order('order_index'),
      supabase.from('menu_categories').select('*').order('order_index'),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('site_settings').select('key, value'),
      supabase.from('catering_items').select('*').order('category_id').order('order_index'),
      supabase.from('catering_categories').select('*').order('order_index'),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    ])

    if (settingsRes.data) {
      const hero = settingsRes.data.find((s: any) => s.key === 'hero_image_url')
      if (hero) setCurrentHeroImage(hero.value)
      
      const cHero = settingsRes.data.find((s: any) => s.key === 'catering_hero_image')
      if (cHero) setCateringHeroImage(cHero.value)
      
      const cVid = settingsRes.data.find((s: any) => s.key === 'catering_video')
      if (cVid) setCateringVideo(cVid.value)
      
      const cText = settingsRes.data.find((s: any) => s.key === 'catering_text')
      if (cText) setCateringText(cText.value)
      
      const cArText = settingsRes.data.find((s: any) => s.key === 'catering_arabic_text')
      if (cArText) setCateringArabicText(cArText.value)
      
      const logo = settingsRes.data.find((s: any) => s.key === 'navbar_logo')
      if (logo) setNavbarLogo(logo.value)
    }
    if (itemsRes.data) setItems(itemsRes.data)
    if (catsRes.data) {
      setCategories(catsRes.data)
      if (catsRes.data.length > 0) setCategoryId(catsRes.data[0].id)
    }
    if (profsRes.data) setProfiles(profsRes.data)
    if (cateringItemsRes.data) setCateringItems(cateringItemsRes.data)
    if (cateringCatsRes.data) setCateringCategories(cateringCatsRes.data)
    if (inquiriesRes.data) setInquiries(inquiriesRes.data)
      
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
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

  const handleDeleteCateringItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this catering item?')) {
      await supabase.from('catering_items').delete().eq('id', id)
      fetchData()
    }
  }

  const handleDeleteCateringCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? All catering items in this category will also be deleted!')) {
      await supabase.from('catering_categories').delete().eq('id', id)
      fetchData()
    }
  }

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    await supabase.from('inquiries').update({ status: newStatus }).eq('id', id)
    fetchData()
  }

  const handleAddMenuCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMenuCategory.trim()) return
    await supabase.from('menu_categories').insert({ name: newMenuCategory.trim(), order_index: categories.length })
    setNewMenuCategory('')
    fetchData()
  }

  const handleAddCateringCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCateringCategory.trim()) return
    await supabase.from('catering_categories').insert({ name: newCateringCategory.trim(), order_index: cateringCategories.length })
    setNewCateringCategory('')
    fetchData()
  }

  const openAddModal = () => {
    setModalType('menu')
    setEditingItem(null)
    setTitle('')
    setPrice('')
    setDescription('')
    if (categories.length > 0) setCategoryId(categories[0].id)
    else setCategoryId('')
    setImageFile(null)
    setAddons([])
    if (fileInputRef.current) fileInputRef.current.value = ''
    setIsCreatingCategory(categories.length === 0)
    setNewModalCategoryName('')
    setShowModal(true)
  }

  const openEditModal = (item: any) => {
    setModalType('menu')
    setEditingItem(item)
    setTitle(item.title)
    setPrice(item.price)
    setDescription(item.description || '')
    setCategoryId(item.category_id)
    setImageFile(null)
    setAddons(item.menu_item_addons || [])
    if (fileInputRef.current) fileInputRef.current.value = ''
    setIsCreatingCategory(false)
    setNewModalCategoryName('')
    setShowModal(true)
  }

  const openAddCateringModal = () => {
    setModalType('catering')
    setEditingItem(null)
    setTitle('')
    setDescription('')
    if (cateringCategories.length > 0) setCategoryId(cateringCategories[0].id)
    else setCategoryId('')
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setIsCreatingCategory(cateringCategories.length === 0)
    setNewModalCategoryName('')
    setShowModal(true)
  }

  const openEditCateringModal = (item: any) => {
    setModalType('catering')
    setEditingItem(item)
    setTitle(item.title)
    setDescription(item.description || '')
    setCategoryId(item.category_id)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setIsCreatingCategory(false)
    setNewModalCategoryName('')
    setShowModal(true)
  }

  const handleAddAddon = () => setAddons([...addons, { title: '', price: '' }])
  const handleRemoveAddon = (index: number) => setAddons(addons.filter((_, i) => i !== index))
  const handleUpdateAddon = (index: number, field: string, value: string) => {
    const newAddons = [...addons]
    newAddons[index] = { ...newAddons[index], [field]: value }
    setAddons(newAddons)
  }

  const formatPriceString = (val: string) => {
    if (!val) return val
    const numericVal = parseFloat(val.replace(/[^0-9.]/g, ''))
    if (isNaN(numericVal)) return val
    
    const hasPlus = val.trim().startsWith('+')
    return `${hasPlus ? '+' : ''}$${numericVal.toFixed(2)}`
  }

  const handlePriceBlur = () => setPrice(formatPriceString(price))
  
  const handleAddonPriceBlur = (index: number) => {
    const newAddons = [...addons]
    newAddons[index].price = formatPriceString(newAddons[index].price)
    setAddons(newAddons)
  }

  const handleSaveCateringSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingCateringSettings(true)

    let finalImageUrl = cateringHeroImage
    let finalVideoUrl = cateringVideo

    if (cateringHeroFile) {
      const fileExt = cateringHeroFile.name.split('.').pop()
      const fileName = `catering_hero_${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('menu_images').upload(fileName, cateringHeroFile)
      if (!error) {
        const { data } = supabase.storage.from('menu_images').getPublicUrl(fileName)
        finalImageUrl = data.publicUrl
      }
    }

    if (cateringVideoFile) {
      const fileExt = cateringVideoFile.name.split('.').pop()
      const fileName = `catering_video_${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('menu_images').upload(fileName, cateringVideoFile)
      if (!error) {
        const { data } = supabase.storage.from('menu_images').getPublicUrl(fileName)
        finalVideoUrl = data.publicUrl
      }
    }

    await supabase.from('site_settings').upsert([
      { key: 'catering_hero_image', value: finalImageUrl },
      { key: 'catering_video', value: finalVideoUrl },
      { key: 'catering_text', value: cateringText },
      { key: 'catering_arabic_text', value: cateringArabicText },
    ])

    setCateringHeroImage(finalImageUrl)
    setCateringVideo(finalVideoUrl)
    setCateringHeroFile(null)
    setCateringVideoFile(null)
    setIsSavingCateringSettings(false)
    alert('Catering settings updated successfully!')
  }

  const handleSaveNavbarLogo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!navbarLogoFile) return
    setIsSavingLogo(true)

    const fileExt = navbarLogoFile.name.split('.').pop()
    const fileName = `navbar_logo_${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('menu_images').upload(fileName, navbarLogoFile)

    if (uploadError) {
      alert('Failed to upload logo image')
      setIsSavingLogo(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('menu_images').getPublicUrl(fileName)
    
    await supabase.from('site_settings').upsert({ key: 'navbar_logo', value: publicUrl })
    
    setNavbarLogo(publicUrl)
    setNavbarLogoFile(null)
    setIsSavingLogo(false)
    alert('Navbar logo updated successfully!')
  }

  const handleSaveHeroImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!heroImageFile) return
    setIsSavingHero(true)

    const fileExt = heroImageFile.name.split('.').pop()
    const fileName = `hero_${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('menu_images').upload(fileName, heroImageFile)

    if (uploadError) {
      alert('Failed to upload hero image')
      setIsSavingHero(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('menu_images').getPublicUrl(fileName)
    
    await supabase.from('site_settings').upsert({ key: 'hero_image_url', value: publicUrl })
    
    setCurrentHeroImage(publicUrl)
    setHeroImageFile(null)
    setIsSavingHero(false)
    alert('Hero image updated successfully!')
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

    let finalCategoryId = categoryId
    if (isCreatingCategory || !categoryId) {
      if (newModalCategoryName.trim()) {
        const catTable = modalType === 'menu' ? 'menu_categories' : 'catering_categories'
        const catOrder = modalType === 'menu' ? categories.length : cateringCategories.length
        const { data: catData, error: catError } = await supabase.from(catTable).insert({ name: newModalCategoryName.trim(), order_index: catOrder }).select().single()
        if (catData) finalCategoryId = catData.id
      } else {
        alert('Please provide a category.')
        setIsSaving(false)
        return
      }
    }

    const payload = {
      title,
      description,
      category_id: finalCategoryId,
      image_url: imageUrl
    } as any


    if (modalType === 'menu') {
      payload.price = price
    }

    const table = modalType === 'menu' ? 'menu_items' : 'catering_items'

    let itemId = editingItem?.id
    if (editingItem) {
      await supabase.from(table).update(payload).eq('id', editingItem.id)
    } else {
      const { data, error } = await supabase.from(table).insert(payload).select().single()
      if (data) itemId = data.id
    }

    if (itemId && modalType === 'menu') {
      await supabase.from('menu_item_addons').delete().eq('item_id', itemId)
      const validAddons = addons.filter(a => a.title.trim() !== '')
      if (validAddons.length > 0) {
        const addonsToInsert = validAddons.map(a => ({ item_id: itemId, title: a.title, price: a.price || '' }))
        await supabase.from('menu_item_addons').insert(addonsToInsert)
      }
    }

    setShowModal(false)
    setIsSaving(false)
    fetchData()
  }

  const handleSort = (key: string) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedItems = [...items].sort((a, b) => {
    if (!sortConfig.key) return 0

    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

    if (sortConfig.key === 'category') {
      const aCat = categories.find(c => c.id === a.category_id)?.name || ''
      const bCat = categories.find(c => c.id === b.category_id)?.name || ''
      aValue = aCat
      bValue = bCat
    } else if (sortConfig.key === 'price') {
      aValue = parseFloat(a.price.replace(/[^0-9.-]+/g,"")) || 0
      bValue = parseFloat(b.price.replace(/[^0-9.-]+/g,"")) || 0
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  if (loading) return <div className={styles.container}>Loading dashboard...</div>

  const pendingCount = inquiries.filter(i => i.status === 'pending').length

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </header>

      <div className={styles.tabs}>
        <button className={activeTab === 'menu' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('menu')}>Menu Items</button>
        <button className={activeTab === 'catering' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('catering')}>Catering Items</button>
        <button className={activeTab === 'categories' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('categories')}>Categories</button>
        <button className={activeTab === 'inquiries' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('inquiries')}>
          Inquiries {pendingCount > 0 && <span style={{ background: 'var(--primary-gold)', color: 'black', padding: '2px 6px', borderRadius: '12px', fontSize: '0.8rem', marginLeft: '5px', fontWeight: 'bold' }}>{pendingCount}</span>}
        </button>
        <button className={activeTab === 'users' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('users')}>Access Requests</button>
        <button className={activeTab === 'settings' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('settings')}>Site Settings</button>
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
              <button onClick={openAddModal} className={styles.primaryBtn}>Add New Item</button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th onClick={() => handleSort('title')} style={{cursor: 'pointer'}}>Name {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('category')} style={{cursor: 'pointer'}}>Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('price')} style={{cursor: 'pointer'}}>Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url && <img src={item.image_url} alt={item.title} className={styles.thumb} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />}
                    </td>
                    <td>{item.title}</td>
                    <td>{categories.find(c => c.id === item.category_id)?.name || 'Unknown'}</td>
                    <td>{item.price}</td>
                    <td>
                      <div className={styles.actions}>
                        <button onClick={() => openEditModal(item)} className={styles.actionBtn}>Edit</button>
                        <button onClick={() => handleDeleteItem(item.id)} className={styles.dangerBtn}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'catering' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Catering Settings</h2>
            </div>
            <form onSubmit={handleSaveCateringSettings} className={styles.form} style={{ maxWidth: '800px', marginBottom: '3rem', padding: '1.5rem', background: '#1a1a24', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className={styles.formGroup}>
                  <label>Hero Image</label>
                  {cateringHeroImage && (
                    <img src={cateringHeroImage} alt="Catering Hero" className={styles.thumb} style={{ width: '100%', height: '120px', objectFit: 'cover', marginBottom: '1rem', borderRadius: '8px' }} />
                  )}
                  <input type="file" accept="image/*" onChange={e => setCateringHeroFile(e.target.files ? e.target.files[0] : null)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Video (MP4)</label>
                  {cateringVideo && (
                    <video src={cateringVideo} className={styles.thumb} style={{ width: '100%', height: '120px', objectFit: 'cover', marginBottom: '1rem', borderRadius: '8px' }} muted />
                  )}
                  <input type="file" accept="video/mp4,video/*" onChange={e => setCateringVideoFile(e.target.files ? e.target.files[0] : null)} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>English Text</label>
                <textarea value={cateringText} onChange={e => setCateringText(e.target.value)} rows={3} placeholder="Whether it's a family gathering..." />
              </div>
              <div className={styles.formGroup}>
                <label>Arabic Text</label>
                <textarea value={cateringArabicText} onChange={e => setCateringArabicText(e.target.value)} rows={3} dir="rtl" placeholder="مستعدون لتجهيز..." />
              </div>
              <button type="submit" disabled={isSavingCateringSettings} className={styles.primaryBtn}>
                {isSavingCateringSettings ? 'Saving...' : 'Save Catering Settings'}
              </button>
            </form>

            <div className={styles.sectionHeader}>
              <h2>Catering Items</h2>
              <button onClick={openAddCateringModal} className={styles.primaryBtn}>Add Catering Item</button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cateringItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url && <img src={item.image_url} alt={item.title} className={styles.thumb} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />}
                    </td>
                    <td>{item.title}</td>
                    <td>{cateringCategories.find(c => c.id === item.category_id)?.name || 'Unknown'}</td>
                    <td>
                      <div className={styles.actions}>
                        <button onClick={() => openEditCateringModal(item)} className={styles.actionBtn}>Edit</button>
                        <button onClick={() => handleDeleteCateringItem(item.id)} className={styles.dangerBtn}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className={styles.section}>
            <h2>Menu Categories</h2>
            <form onSubmit={handleAddMenuCategory} style={{ display: 'flex', gap: '10px', marginBottom: '1rem', maxWidth: '400px' }}>
              <input type="text" value={newMenuCategory} onChange={e => setNewMenuCategory(e.target.value)} placeholder="New Category Name" required style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white' }} />
              <button type="submit" className={styles.primaryBtn} style={{ padding: '0.5rem 1rem' }}>Add</button>
            </form>
            <ul className={styles.list}>
              {categories.map(c => (
                <li key={c.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{c.name}</span>
                  <button className={styles.dangerBtn} onClick={() => handleDeleteCategory(c.id)}>Delete</button>
                </li>
              ))}
            </ul>
            <h2 style={{ marginTop: '2rem' }}>Catering Categories</h2>
            <form onSubmit={handleAddCateringCategory} style={{ display: 'flex', gap: '10px', marginBottom: '1rem', maxWidth: '400px' }}>
              <input type="text" value={newCateringCategory} onChange={e => setNewCateringCategory(e.target.value)} placeholder="New Category Name" required style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white' }} />
              <button type="submit" className={styles.primaryBtn} style={{ padding: '0.5rem 1rem' }}>Add</button>
            </form>
            <ul className={styles.list}>
              {cateringCategories.map(c => (
                <li key={c.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{c.name}</span>
                  <button className={styles.dangerBtn} onClick={() => handleDeleteCateringCategory(c.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className={styles.section}>
            <h2>Inquiries</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Item</th>
                  <th>Email</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(i => (
                  <tr key={i.id}>
                    <td>{new Date(i.created_at).toLocaleDateString()}</td>
                    <td>{i.item_title}</td>
                    <td><a href={`mailto:${i.user_email}`} style={{ color: 'var(--primary-gold)' }}>{i.user_email}</a></td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>{i.notes}</td>
                    <td><span className={styles['badge-' + i.status]}>{i.status}</span></td>
                    <td>
                      <select 
                        value={i.status} 
                        onChange={e => handleUpdateInquiryStatus(i.id, e.target.value)}
                        style={{ padding: '0.5rem', background: '#222', color: 'white', border: '1px solid #444', borderRadius: '4px' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="contacted">Contacted</option>
                        <option value="agreed">Agreed</option>
                        <option value="fulfilled">Fulfilled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.section}>
            <h2>Site Settings</h2>
            
            <form onSubmit={handleSaveNavbarLogo} className={styles.form} style={{ maxWidth: '500px', marginBottom: '3rem' }}>
              <div className={styles.formGroup}>
                <label>Navbar Logo</label>
                {navbarLogo && (
                  <img src={navbarLogo} alt="Navbar Logo" className={styles.thumb} style={{ width: 'auto', height: '50px', objectFit: 'contain', marginBottom: '1rem', background: '#000', padding: '10px', borderRadius: '8px' }} />
                )}
                <input type="file" accept="image/*" onChange={e => setNavbarLogoFile(e.target.files ? e.target.files[0] : null)} required />
              </div>
              <button type="submit" disabled={isSavingLogo || !navbarLogoFile} className={styles.primaryBtn} style={{ marginTop: '1rem' }}>
                {isSavingLogo ? 'Saving...' : 'Update Navbar Logo'}
              </button>
            </form>

            <form onSubmit={handleSaveHeroImage} className={styles.form} style={{ maxWidth: '500px' }}>
              <div className={styles.formGroup}>
                <label>Hero Image</label>
                {currentHeroImage && (
                  <img src={currentHeroImage} alt="Current Hero" className={styles.thumb} style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover', marginBottom: '1rem', borderRadius: '8px' }} />
                )}
                <input type="file" accept="image/*" onChange={e => setHeroImageFile(e.target.files ? e.target.files[0] : null)} required />
              </div>
              <button type="submit" disabled={isSavingHero || !heroImageFile} className={styles.primaryBtn} style={{ marginTop: '1rem' }}>
                {isSavingHero ? 'Saving...' : 'Update Hero Image'}
              </button>
            </form>
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
               <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSaveItem} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              
              {modalType === 'menu' && (
                <div className={styles.formGroup}>
                  <label>Price</label>
                  <input type="text" value={price} onChange={e => setPrice(e.target.value)} onBlur={handlePriceBlur} required placeholder="e.g. 12.99 or +2.00" />
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
              </div>

              <div className={styles.formGroup}>
                <label>Category</label>
                {isCreatingCategory ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Enter new category name" value={newModalCategoryName} onChange={e => setNewModalCategoryName(e.target.value)} required style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white' }} />
                    {((modalType === 'menu' && categories.length > 0) || (modalType === 'catering' && cateringCategories.length > 0)) && (
                      <button type="button" className={styles.cancelBtn} onClick={() => setIsCreatingCategory(false)}>Cancel</button>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required style={{ flex: 1 }}>
                      <option value="" disabled>Select a category</option>
                      {modalType === 'menu' ? categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      )) : cateringCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <button type="button" className={styles.actionBtn} onClick={() => setIsCreatingCategory(true)}>+ New</button>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Image</label>
                {editingItem?.image_url && !imageFile && (
                  <img src={editingItem.image_url} alt="Preview" className={styles.thumb} style={{ width: '100px', marginBottom: '10px' }} />
                )}
                <input type="file" accept="image/*" ref={fileInputRef} onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
              </div>

              {modalType === 'menu' && (
                <div className={styles.formGroup}>
                  <label>Add-ons</label>
                  {addons.map((addon, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <input type="text" placeholder="Addon title" value={addon.title} onChange={e => handleUpdateAddon(index, 'title', e.target.value)} style={{ flex: 2, minWidth: 0 }} />
                      <input type="text" placeholder="Price (e.g. +1.50)" value={addon.price} onChange={e => handleUpdateAddon(index, 'price', e.target.value)} onBlur={() => handleAddonPriceBlur(index)} style={{ flex: 1, minWidth: 0 }} />
                      <button type="button" onClick={() => handleRemoveAddon(index)} className={styles.dangerBtn} style={{ whiteSpace: 'nowrap' }}>Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddAddon} className={styles.actionBtn}>+ Add Add-on</button>
                </div>
              )}

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
