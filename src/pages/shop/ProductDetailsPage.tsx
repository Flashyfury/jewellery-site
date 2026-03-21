import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import type { Product } from '../../types'
import { Button } from '../../components/ui/Button'
import { useCart } from '../../context/CartContext'
import { ArrowLeft } from 'lucide-react'

export function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        if (data) setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground font-serif text-lg">Curating details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-background flex-col gap-6">
        <h2 className="text-3xl font-serif text-muted-foreground">Piece Not Found</h2>
        <Link to="/shop">
          <Button variant="outline">Return to Collection</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background pt-24 md:pt-28 pb-24">
      <div className="container mx-auto px-6">
        <Link to="/shop" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collection
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[4/5] overflow-hidden rounded-3xl bg-muted/20 relative"
          >
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif italic text-xl">
                Image coming soon
              </div>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            {product.stock <= 0 && (
              <span className="text-sm font-semibold tracking-wider text-red-500 uppercase mb-4">
                Sold Out
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
               <span className="text-sm font-semibold tracking-wider text-accent uppercase mb-4">
                 Only {product.stock} left in stock
               </span>
            )}
            
            <h1 className="text-4xl lg:text-5xl font-serif tracking-tight mb-4">{product.name}</h1>
            <p className="text-2xl font-medium mb-8">₹{product.price.toFixed(2)}</p>
            
            <div className="h-[1px] w-full bg-border mb-8"></div>
            
            <div className="prose prose-sm text-muted-foreground mb-10 leading-relaxed">
              <p>{product.description || "A breathtaking piece designed to complement your unique style. Detailed description coming soon."}</p>
            </div>
            
            <div className="mt-auto">
              <Button 
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className="w-full md:w-auto px-12 py-6 text-lg rounded-full"
              >
                {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
