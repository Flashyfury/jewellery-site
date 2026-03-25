import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Product } from '../../types'
import { Button } from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'
import { useCart } from '../../context/CartContext'

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data) setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="w-full min-h-screen bg-background pt-24 md:pt-28 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">The Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our meticulously curated selection of timeless jewelry pieces.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse border-none shadow-none bg-muted/30">
                <CardContent className="p-0">
                  <div className="aspect-[4/5] bg-muted w-full rounded-t-3xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-serif text-muted-foreground">No pieces currently available.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon for new arrivals.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -8 }}
                className="group relative bg-white p-3 rounded-[2rem] transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(178,190,181,0.4)]"
              >
                <Link to={`/shop/${product.id}`} className="block">
                  <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-muted/20 relative">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="object-contain w-full h-full transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif italic text-sm">
                        No Image
                      </div>
                    )}
                    {product.stock <= 0 && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                        Sold Out
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="mt-5 mb-2 px-2 flex flex-col items-start">
                  <Link to={`/shop/${product.id}`} className="hover:text-accent transition-colors">
                    <h3 className="text-lg font-serif text-foreground">{product.name}</h3>
                  </Link>
                  <div className="w-full flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-muted-foreground">₹{product.price.toFixed(2)}</span>
                    <Button 
                      variant="ghost" 
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-2 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-full px-4 h-8 text-xs font-semibold"
                    >
                      Add +
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
