import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const menuData = [
  {
    category: "Appetizers",
    items: [
      { id: "app-1", title: "Hummus", description: "", price: "$5.49" },
      { id: "app-2", title: "Falafel hummus", description: "", price: "$8.99" },
      { id: "app-3", title: "Beef hummus", description: "", price: "$9.99" },
      { id: "app-4", title: "Chicken hummus", description: "", price: "$9.99", image: "/menu_items/Hummus with chicken.png" },
      { id: "app-5", title: "Samosa (3 pieces)", description: "", price: "$4.99", image: "/menu_items/Samosa.png" },
      { id: "app-6", title: "Beef Manakish", description: "", price: "$4.49" }
    ]
  },
  {
    category: "Wraps",
    items: [
      { id: "wrap-1", title: "Falafel wrap", description: "", price: "$7.49" },
      { id: "wrap-2", title: "Chicken shawarma", description: "", price: "$8.99", image: "/menu_items/Chicken shawarma wrap.png" },
      { id: "wrap-3", title: "Beef shawarma", description: "", price: "$8.99" },
      { id: "wrap-4", title: "Kabab", description: "", price: "$9.99" },
      { id: "wrap-5", title: "Chicken Kabab", description: "", price: "$9.99" },
      { id: "wrap-6", title: "Shish Tawook", description: "", price: "$10.99" }
    ]
  },
  {
    category: "Combination Plates",
    items: [
      { id: "plate-1", title: "Falafel plate", description: "", price: "$15.99" },
      { id: "plate-2", title: "Chicken shawarma plate", description: "", price: "$17.49", image: "/menu_items/Chicken shawarma platter.png" },
      { id: "plate-3", title: "Beef shawarma plate", description: "", price: "$17.49" },
      { id: "plate-4", title: "Mix shawarma plate", description: "", price: "$18.49" },
      { id: "plate-5", title: "Kabab plate", description: "", price: "$17.99" },
      { id: "plate-6", title: "Chicken Kabab plate", description: "", price: "$17.99" },
      { id: "plate-7", title: "Shish Tawook plate", description: "", price: "$18.99" },
      { id: "plate-8", title: "Mixed grill plate", description: "", price: "$21.99" },
      { id: "plate-9", title: "Chicken shawarma with Rice", description: "", price: "$10.99", image: "/menu_items/Chicken and rice.png" },
      { id: "plate-10", title: "Beef shawarma with Rice", description: "", price: "$10.99" }
    ]
  },
  {
    category: "Sides",
    items: [
      { id: "side-1", title: "Fries", description: "", price: "$5.49", image: "/menu_items/fries.png" },
      { id: "side-2", title: "Poutine", description: "", price: "$8.99" },
      { id: "side-3", title: "Chicken Poutine", description: "", price: "$10.99", image: "/menu_items/chicken shawarma poutine.png" },
      { id: "side-4", title: "Fries Supreme", description: "", price: "$9.99" }
    ]
  },
  {
    category: "Salads",
    items: [
      { id: "salad-1", title: "Garden Salad", description: "", price: "$7.99", image: "/menu_items/Garden salad.png" },
      { id: "salad-2", title: "Greek Salad", description: "", price: "$8.49" },
      { id: "salad-3", title: "Fattosh Salad", description: "", price: "$8.99", image: "/menu_items/Fattoush salad.png" },
      { id: "salad-4", title: "Add Chicken or Beef Shawarma", description: "Add-on", price: "+$5.49", image: "/menu_items/Fattoush with chicken.png" },
      { id: "salad-5", title: "Add One Skewer Chicken or Beef Kabab", description: "Add-on", price: "+$4.99" },
      { id: "salad-6", title: "Add One Skewer Shisha Tawook", description: "Add-on", price: "+$4.99" },
      { id: "salad-7", title: "Add Four Falafel Pieces", description: "Add-on", price: "+$3.99" }
    ]
  },
  {
    category: "Desserts",
    items: [
      { id: "dessert-1", title: "Baklava", description: "", price: "$2.49" },
      { id: "dessert-2", title: "Kunafe with Ice Cream", description: "", price: "$13.49" },
      { id: "dessert-3", title: "Cheese Kunafe", description: "", price: "$9.99", image: "/menu_items/Kunafa.png" },
      { id: "dessert-4", title: "Cream Kunafe", description: "", price: "$9.99" },
      { id: "dessert-5", title: "Ice Cream", description: "", price: "$4.49" }
    ]
  },
  {
    category: "Cheese Cake By The Cheesecake Factory Bakery",
    items: [
      { id: "cake-1", title: "White Chocolate Raspberry", description: "", price: "$10.49" },
      { id: "cake-2", title: "Wild Strawberries & Cream", description: "", price: "$10.49" },
      { id: "cake-3", title: "OREO Cookies & Cream", description: "", price: "$10.49" },
      { id: "cake-4", title: "Classic Cheesecake", description: "", price: "$9.99" },
      { id: "cake-5", title: "REESES Peanut Butter Chocolate", description: "", price: "$10.49" }
    ]
  },
  {
    category: "Cold Drinks",
    items: [
      { id: "cd-1", title: "Water", description: "", price: "$1" },
      { id: "cd-2", title: "Soft Drinks", description: "", price: "$1.50" },
      { id: "cd-3", title: "Barbican", description: "", price: "$3" },
      { id: "cd-4", title: "Iced Coffee", description: "", price: "$4" }
    ]
  },
  {
    category: "Hot Drinks",
    items: [
      { id: "hd-1", title: "Tea", description: "", price: "$1.99" },
      { id: "hd-2", title: "Black Tea", description: "", price: "$1.99" },
      { id: "hd-3", title: "Green Tea", description: "", price: "$1.99" },
      { id: "hd-4", title: "Ginger Tea", description: "", price: "$1.99" },
      { id: "hd-5", title: "Habiscus", description: "كـركـديـه", price: "$2.49" },
      { id: "hd-6", title: "Chamomile", description: "شاي البابونج", price: "$2.49" },
      { id: "hd-7", title: "Turkish Coffee", description: "", price: "$3.99", image: "/menu_items/turkish coffee.png" },
      { id: "hd-8", title: "Nescafe", description: "", price: "$3.49" },
      { id: "hd-9", title: "Americano", description: "", price: "$2.49" }
    ]
  },
  {
    category: "Shakes",
    items: [
      { id: "shake-1", title: "Banana Milkshake", description: "", price: "$6.99" },
      { id: "shake-2", title: "Strawberry Banana Shake", description: "", price: "$7.49" },
      { id: "shake-3", title: "Lemon Mint Freeze", description: "", price: "$8.99" },
      { id: "shake-4", title: "Citrus Freeze", description: "", price: "$8.49" }
    ]
  },
  {
    category: "Shisha Flavours",
    items: [
      { id: "shisha-1", title: "Double Apple", description: "", price: "$20", image: "/menu_items/Shisha.png" },
      { id: "shisha-2", title: "Gum Mint", description: "", price: "$20" },
      { id: "shisha-3", title: "Lemon Mint", description: "", price: "$20" },
      { id: "shisha-4", title: "Orange Mint", description: "", price: "$20" },
      { id: "shisha-5", title: "Grape Mint", description: "", price: "$20" },
      { id: "shisha-6", title: "Blueberry Mint", description: "", price: "$20" },
      { id: "shisha-7", title: "Kiwi", description: "", price: "$20" },
      { id: "shisha-8", title: "Peach", description: "", price: "$20" }
    ]
  },
  {
    category: "House Mixes & Special Flavours",
    items: [
      { id: "hmix-1", title: "Tropical", description: "", price: "$18" },
      { id: "hmix-2", title: "Kiwi Gum Mint", description: "", price: "$18" },
      { id: "hmix-3", title: "Blue Mist", description: "", price: "$18" },
      { id: "hmix-4", title: "Love66", description: "+ TAX", price: "$23" },
      { id: "hmix-5", title: "Lady's Killer", description: "+ TAX", price: "$23" },
      { id: "hmix-6", title: "Hawaii", description: "+ TAX", price: "$23" }
    ]
  },
  {
    category: "Shisha Addons",
    items: [
      { id: "addon-1", title: "Refill", description: "", price: "$9.99" },
      { id: "addon-2", title: "Ice Hose", description: "", price: "$3.99" },
      { id: "addon-3", title: "Coconut Charcoal", description: "", price: "$2.99" }
    ]
  }
];

async function seed() {
  for (let i = 0; i < menuData.length; i++) {
    const section = menuData[i]
    
    // insert category
    const { data: catData, error: catError } = await supabase
      .from('menu_categories')
      .insert({ name: section.category, order_index: i })
      .select()
      .single()
      
    if (catError) {
      console.error('Error inserting category', section.category, catError)
      continue
    }
    
    const catId = catData.id
    console.log('Inserted category:', section.category)
    
    // insert items
    for (let j = 0; j < section.items.length; j++) {
      const item = section.items[j]
      const { error: itemError } = await supabase
        .from('menu_items')
        .insert({
          category_id: catId,
          title: item.title,
          description: item.description,
          price: item.price,
          image_url: item.image || null,
          order_index: j
        })
        
      if (itemError) {
        console.error('Error inserting item', item.title, itemError)
      } else {
        console.log('  Inserted item:', item.title)
      }
    }
  }
}

seed().then(() => console.log('Done')).catch(console.error)
