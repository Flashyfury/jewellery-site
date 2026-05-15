import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Product, Category } from '../../types'
import { Button } from '../../components/ui/Button'
import { useCart } from '../../context/CartContext'
import { ArrowLeft } from 'lucide-react'
import { ProductDetailSection } from '../../components/shop/ProductDetailSection'

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
          .select('*, category:categories(*)')
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
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-stone-500 font-serif text-lg">Curating details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-white flex-col gap-6">
        <h2 className="text-3xl font-serif text-stone-500">Piece Not Found</h2>
        <Link to="/shop">
          <Button variant="outline">Return to Collection</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white pt-24 md:pt-28 pb-0">
      <div className="container mx-auto px-0 md:px-6">
        <div className="px-6 md:px-0">
          <Link to="/shop" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collection
          </Link>
        </div>
        
        <ProductDetailSection 
          id={product.id}
          name={product.name}
          price={product.price}
          stock={product.stock}
          image={product.image_url}
          description={product.description}
          categoryName={(product.category as unknown as Category)?.name || 'EXCLUSIVE'}
          onAddToCart={() => addToCart(product)}
        />
      </div>
    </div>
  )
}
