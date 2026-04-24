import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateAddons() {
  console.log('Fetching all menu categories and items...')
  
  const { data: categories } = await supabase.from('menu_categories').select('*')
  const { data: items } = await supabase.from('menu_items').select('*')

  if (!categories || !items) throw new Error('Failed to fetch data')

  const saladCat = categories.find(c => c.name === 'Salads')
  const shishaAddonCat = categories.find(c => c.name === 'Shisha Addons')
  const shishaCats = categories.filter(c => c.name === 'Shisha Flavours' || c.name === 'House Mixes & Special Flavours')

  // 1. Salads Addons
  if (saladCat) {
    const saladItems = items.filter(i => i.category_id === saladCat.id)
    
    // Identify the ones that are actual salads vs addons
    const actualSalads = saladItems.filter(i => !i.title.startsWith('Add '))
    const saladAddonItems = saladItems.filter(i => i.title.startsWith('Add '))

    console.log(`Found ${actualSalads.length} actual salads and ${saladAddonItems.length} salad addons`)

    // For each actual salad, insert the addons
    for (const salad of actualSalads) {
      for (const addon of saladAddonItems) {
        await supabase.from('menu_item_addons').insert({
          item_id: salad.id,
          title: addon.title,
          price: addon.price
        })
      }
    }

    // Delete the old salad addon items
    for (const addon of saladAddonItems) {
      console.log(`Deleting old salad addon item: ${addon.title}`)
      await supabase.from('menu_items').delete().eq('id', addon.id)
    }
  }

  // 2. Shisha Addons
  if (shishaAddonCat) {
    const shishaAddons = items.filter(i => i.category_id === shishaAddonCat.id)
    
    let allShishas = []
    for (const sc of shishaCats) {
      allShishas = allShishas.concat(items.filter(i => i.category_id === sc.id))
    }

    console.log(`Found ${allShishas.length} shishas and ${shishaAddons.length} shisha addons`)

    for (const shisha of allShishas) {
      for (const addon of shishaAddons) {
        // Format price to ensure it has '+' if it makes sense? The user wants $ format. We'll just copy the string.
        let priceStr = addon.price
        if (!priceStr.startsWith('+') && !priceStr.startsWith('-')) {
          priceStr = '+' + priceStr
        }

        await supabase.from('menu_item_addons').insert({
          item_id: shisha.id,
          title: addon.title,
          price: priceStr
        })
      }
    }

    // Delete the old shisha addon category completely (which deletes items due to CASCADE, or we delete items first)
    // Actually we have a trigger that deletes category when empty, so let's just delete the items.
    for (const addon of shishaAddons) {
      console.log(`Deleting old shisha addon item: ${addon.title}`)
      await supabase.from('menu_items').delete().eq('id', addon.id)
    }
  }

  console.log('Migration complete.')
}

migrateAddons().catch(console.error)
