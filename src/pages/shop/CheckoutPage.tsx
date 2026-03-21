import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Trash2, ArrowRight, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export function CheckoutPage() {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    country: ''
  })

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      toast.error('Your cart is empty.')
      return
    }

    setIsSubmitting(true)

    try {
      // Create Order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: 'guest',
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          total_amount: cartTotal,
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create Order Items
      const orderItems = cart.map((item: any) => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Future: Send Email Notification to Admin via Edge Function / API

      toast.success('Order placed successfully! We will contact you soon.')
      clearCart()
      navigate('/')

    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }



  if (cart.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-background px-6">
        <h2 className="text-3xl font-serif mb-4">Your bag is empty</h2>
        <p className="text-muted-foreground mb-8">Discover our new collections and find your perfect piece.</p>
        <Link to="/shop">
          <Button className="px-10 py-5 rounded-full">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background pt-24 md:pt-28 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-4xl font-serif mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-xl font-medium tracking-tight border-b border-border pb-4">Your Pieces</h2>
            <div className="space-y-6">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-6 items-center"
                >
                  <div className="w-24 h-32 rounded-xl bg-muted/20 overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">₹{item.price.toFixed(2)}</p>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-border rounded-full px-3 py-1">
                        <button
                          type="button"
                          className="px-2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >-</button>
                        <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          className="px-2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary & Checkout Form */}
          <div className="lg:col-span-5">
            <div className="bg-muted/10 border border-border rounded-3xl p-8 sticky top-28">
              <h2 className="text-xl font-medium tracking-tight mb-6">Order Summary</h2>

              <div className="space-y-4 text-sm mb-6 border-b border-border pb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Complimentary</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-serif text-xl">Total</span>
                <span className="font-serif text-2xl">₹{cartTotal.toFixed(2)}</span>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-2">Full Name</label>
                    <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Jane Doe" className="bg-white/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-2">Email Address</label>
                    <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="jane@example.com" className="bg-white/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-2">Phone Number</label>
                    <Input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" className="bg-white/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-2">Delivery Address (Mock)</label>
                    <Input required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123 Exclusive Avenue, NY 10001" className="bg-white/50" />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 text-lg group"
                >
                  {isSubmitting ? 'Processing...' : 'Place Secure Order'}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>
                <p className="flex items-center justify-center text-xs text-muted-foreground mt-4 gap-2">
                  <ShieldCheck className="w-4 h-4" /> Secure checkout verified by Olivia's
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
