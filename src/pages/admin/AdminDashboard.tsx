import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Product, Order, Category } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Trash2, Plus, Edit2, Package, ShoppingBag, LayoutDashboard, TrendingUp, DollarSign, Archive, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const statCards = [
  { key: 'revenue', label: 'Total Revenue', icon: DollarSign, gradient: 'stat-card-purple', glow: 'glow-purple', iconBg: 'from-purple-400 to-indigo-500' },
  { key: 'orders', label: 'Total Orders', icon: TrendingUp, gradient: 'stat-card-emerald', glow: 'glow-emerald', iconBg: 'from-emerald-400 to-teal-500' },
  { key: 'products', label: 'Products in Catalog', icon: Archive, gradient: 'stat-card-amber', glow: 'glow-rose', iconBg: 'from-pink-400 to-rose-500' },
] as const

const statusColors: Record<string, string> = {
  pending: 'badge-info',
  processing: 'badge-warning',
  shipped: 'badge-purple',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
}

const statusDots: Record<string, string> = {
  pending: 'bg-blue-400',
  processing: 'bg-amber-400',
  shipped: 'bg-purple-400',
  delivered: 'bg-emerald-400',
  cancelled: 'bg-red-400',
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  
  // Product Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [file, setFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('sort_order', { ascending: true })
      ])
      
      if (productsRes.data) setProducts(productsRes.data as Product[])
      if (ordersRes.data) setOrders(ordersRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProductModalOpen(false)
    
    const loadingToast = toast.loading(editingProduct ? 'Updating product...' : 'Creating product...')
    
    try {
      let image_url = editingProduct?.image_url || ''
      
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)
          
        if (uploadError) throw uploadError
        
        const { data: publicURLData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
          
        image_url = publicURLData.publicUrl
      }
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image_url,
        category_id: formData.category_id || null
      }
      
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          
        if (error) throw error
        toast.success('Product updated successfully', { id: loadingToast })
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])
          
        if (error) throw error
        toast.success('Product created successfully', { id: loadingToast })
      }
      
      fetchData()
      resetForm()
    } catch (error) {
      console.error('Product save error:', error)
      toast.error('Failed to save product', { id: loadingToast })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      toast.success('Product deleted')
      fetchData()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id)
      if (error) throw error
      toast.success('Order status updated')
      fetchData()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '', category_id: '' })
    setFile(null)
    setEditingProduct(null)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id || ''
    })
    setIsProductModalOpen(true)
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'products' as const, label: 'Products', icon: ShoppingBag },
    { id: 'orders' as const, label: 'Orders', icon: Package },
  ]

  const getStatValue = (key: string) => {
    switch (key) {
      case 'revenue': return `$${orders.reduce((acc, order) => acc + order.total_amount, 0).toFixed(2)}`
      case 'orders': return orders.length.toString()
      case 'products': return products.length.toString()
      default: return '0'
    }
  }

  return (
    <div className="w-full min-h-screen bg-muted/10 pt-10 pb-24 flex flex-col md:flex-row">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-full md:w-72 bg-background border-r border-border p-6 flex flex-col gap-2 relative z-10 hidden md:flex min-h-[80vh] rounded-tr-3xl">
        {/* Decorative gradient at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-tr-3xl" />
        
        <div className="mb-8 px-2 pt-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-serif tracking-tight">Admin Portal</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider pl-10">Olivia's Exclusive</p>
        </div>
        
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium ${
              activeTab === tab.id
                ? 'sidebar-active'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
            whileHover={{ x: activeTab === tab.id ? 0 : 4 }}
            whileTap={{ scale: 0.98 }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="sidebar-indicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        ))}
        
        {/* Sidebar decorative element */}
        <div className="mt-auto pt-6 border-t border-border">
          <div className="px-2 py-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
            <p className="text-xs font-medium text-purple-600 mb-1">✨ Pro Tip</p>
            <p className="text-xs text-muted-foreground">Keep your inventory updated for happy customers!</p>
          </div>
        </div>
      </aside>

      {/* ===== MOBILE TAB BAR ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border px-4 py-2">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-muted-foreground'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20'
                  : ''
              }`}>
                <tab.icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-medium ${activeTab === tab.id ? 'text-foreground' : ''}`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-6 lg:p-12 relative">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ===== OVERVIEW TAB ===== */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <div className="flex items-center gap-3 mb-8">
                  <h1 className="text-3xl font-serif">Dashboard Overview</h1>
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-xs font-medium text-purple-600 border border-purple-200/50">
                    Live
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {statCards.map((card, i) => (
                    <motion.div
                      key={card.key}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ 
                        y: -6,
                        transition: { duration: 0.3 }
                      }}
                      className={`relative p-6 rounded-2xl ${card.gradient} shimmer cursor-default overflow-hidden group`}
                    >
                      {/* Background decoration */}
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-700" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 translate-y-6 -translate-x-6" />
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm text-white/80 font-medium">{card.label}</p>
                          <motion.div 
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-lg`}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <card.icon className="w-5 h-5 text-white" />
                          </motion.div>
                        </div>
                        <p className="text-3xl font-serif font-bold text-white tracking-tight">
                          {getStatValue(card.key)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick activity section */}
                <div className="bg-background border border-border p-6 rounded-2xl">
                  <h3 className="text-lg font-serif mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse" />
                    Recent Activity
                  </h3>
                  {orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order, i) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.08 }}
                          className="flex items-center justify-between py-3 border-b border-border/50 last:border-none"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${statusDots[order.status] || 'bg-gray-400'} ${(order.status === 'pending' || order.status === 'processing') ? 'animate-pulse' : ''}`} />
                            <div>
                              <p className="text-sm font-medium">{order.customer_name}</p>
                              <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                              {order.status}
                            </span>
                            <span className="text-sm font-medium">${order.total_amount.toFixed(2)}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No recent activity</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ===== PRODUCTS TAB ===== */}
            {activeTab === 'products' && (
              <motion.div key="products" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-serif">Product Management</h1>
                  <Button 
                    onClick={() => { resetForm(); setIsProductModalOpen(true); }} 
                    className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </Button>
                </div>
                
                <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border font-medium">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4 hidden sm:table-cell">Price</th>
                        <th className="p-4 hidden sm:table-cell">Stock</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {products.map((product, i) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="table-row-interactive"
                        >
                          <td className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-muted/50 to-muted rounded-xl overflow-hidden flex-shrink-0 border border-border/50">
                              {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              {product.category && (
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/50 text-xs text-purple-600 capitalize">
                                  {(product.category as unknown as Category)?.name}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 hidden sm:table-cell font-medium">${product.price.toFixed(2)}</td>
                          <td className="p-4 hidden sm:table-cell">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'
                            }`}>
                              {product.stock} in stock
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <motion.button 
                                onClick={() => openEditModal(product)} 
                                className="p-2 rounded-lg text-muted-foreground hover:text-blue-500 hover:bg-blue-50 transition-all"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Edit2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button 
                                onClick={() => handleDeleteProduct(product.id)} 
                                className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                      {products.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-muted-foreground italic">No products found. Add your first piece.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ===== ORDERS TAB ===== */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <h1 className="text-3xl font-serif mb-8">Recent Orders</h1>
                
                <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border font-medium">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.map((order, i) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="table-row-interactive"
                        >
                          <td className="p-4 font-mono text-xs text-muted-foreground">{order.id.split('-')[0]}...</td>
                          <td className="p-4">
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                          </td>
                          <td className="p-4 font-medium">${order.total_amount.toFixed(2)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${statusDots[order.status] || 'bg-gray-400'} ${(order.status === 'pending' || order.status === 'processing') ? 'animate-pulse' : ''}`} />
                              <select 
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="bg-transparent border border-border rounded-lg text-xs px-2 py-1 focus:ring-accent outline-none"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-muted-foreground italic">No orders yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* ===== PRODUCT MODAL ===== */}
      <AnimatePresence>
        {isProductModalOpen && (
          <motion.div 
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{scale:0.9, opacity:0, y:20}} 
              animate={{scale:1, opacity:1, y:0}} 
              exit={{scale:0.9, opacity:0, y:20}}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="bg-background border border-border rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              {/* Gradient header bar */}
              <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500" />
              
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      {editingProduct ? <Edit2 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
                    </div>
                    <h2 className="text-2xl font-serif">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  </div>
                  <motion.button 
                    onClick={() => setIsProductModalOpen(false)} 
                    className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    ✕
                  </motion.button>
                </div>
                
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name</label>
                    <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="E.g., Diamond Pendant" className="focus:ring-purple-400 focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <textarea 
                      className="w-full border border-input rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 bg-transparent transition-all"
                      required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                      placeholder="Product details..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Price ($)</label>
                      <Input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="focus:ring-purple-400 focus:border-purple-400" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Stock</label>
                      <Input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="focus:ring-purple-400 focus:border-purple-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <select
                      value={formData.category_id}
                      onChange={e => setFormData({...formData, category_id: e.target.value})}
                      className="w-full border border-input rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 bg-transparent capitalize transition-all"
                    >
                      <option value="">— No Category —</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Product Image</label>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => { if(e.target.files && e.target.files[0]) setFile(e.target.files[0]) }} 
                      className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100"
                    />
                    {editingProduct?.image_url && !file && <p className="text-xs text-muted-foreground mt-2">Current image will be kept if no new file is selected.</p>}
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-8">
                    <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20"
                    >
                      {editingProduct ? 'Save Changes' : 'Create Product'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
