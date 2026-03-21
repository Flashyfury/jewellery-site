import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import type { Product, Category } from '../../types'
import { Button } from '../../components/ui/Button'
import { useCart } from '../../context/CartContext'
import { ChevronRight } from 'lucide-react'

// Static hero images keyed by slug (used as fallback / aesthetic bg)
const heroImages: Record<string, string> = {
  rings:      '/images/category_ring_1_1772952763774.png',
  necklaces:  '/images/floating_necklace_1772919070657.png',
  earrings:   '/images/floating_earrings_1772919189881.png',
  bracelets:  '/images/category_ring_2_1772952780620.png',
}

const defaultHeroBg = 'from-stone-50 via-neutral-50 to-gray-50'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function CollectionPage() {
  const { category: slug } = useParams<{ category: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    setProducts([])
    setCategory(null)

    async function load() {
      // 1. Fetch the category by slug
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (catError || !catData) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setCategory(catData)

      // 2. Fetch products for this category_id
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', catData.id)
        .order('created_at', { ascending: false })

      if (prodData) setProducts(prodData)
      setLoading(false)
    }

    load()
  }, [slug])

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-2xl font-serif text-foreground mb-2">Collection not found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find a collection matching "{slug}".</p>
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
          ← Back to Shop
        </Link>
      </div>
    </div>
  )

  const heroBg = category?.hero_bg || defaultHeroBg
  const heroImage = category?.hero_image_url || heroImages[slug || ''] || ''

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className={`relative min-h-[55vh] flex items-center bg-gradient-to-br ${heroBg} overflow-hidden pt-16 md:pt-20`}>
        {/* Floating BG image */}
        {heroImage && (
          <motion.img
            src={heroImage}
            alt={category?.name || ''}
            className="absolute right-0 top-0 h-full w-1/2 object-contain object-right opacity-30 mix-blend-multiply pointer-events-none"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 0.3 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}

        <div className="container mx-auto px-6 py-20 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-8"
          >
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{category?.name || slug}</span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs font-semibold tracking-[0.4em] uppercase text-accent mb-4 block"
          >
            Collection
          </motion.span>

          {loading ? (
            <div className="h-24 w-48 bg-muted/40 rounded-2xl animate-pulse" />
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="text-6xl md:text-8xl font-serif tracking-tight text-foreground mb-4"
              >
                {category?.name}
              </motion.h1>
              {category?.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="max-w-md text-muted-foreground leading-relaxed"
                >
                  {category.description}
                </motion.p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-muted/30 rounded-[2rem] aspect-[4/5]" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <p className="text-6xl mb-6">✨</p>
              <h2 className="text-3xl font-serif mb-4 text-foreground">Coming Soon</h2>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                The {category?.name} collection is being curated. Check back soon!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-white rounded-full font-medium hover:-translate-y-1 transition-transform duration-300"
              >
                Browse All Collections
              </Link>
            </motion.div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-8 uppercase tracking-widest">
                {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
              </p>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={cardVariants}
                    whileHover={{ y: -8 }}
                    className="group relative bg-white p-3 rounded-[2rem] transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(178,190,181,0.4)]"
                  >
                    <Link to={`/shop/${product.id}`} className="block">
                      <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-muted/20 relative">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
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
            </>
          )}
        </div>
      </section>
    </div>
  )
}
