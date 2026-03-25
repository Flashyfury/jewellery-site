import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, Gem } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Product } from '../../types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Fetch results
  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('name', `%${debouncedQuery}%`)
          .limit(10)

        if (error) throw error
        setResults(data || [])
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  const handleSelectProduct = (productId: string) => {
    navigate(`/shop/${productId}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center bg-background/80 backdrop-blur-md pt-[10vh] px-4"
        >
          {/* Close Background Area */}
          <div className="absolute inset-0 z-0" onClick={onClose} />

          {/* Search Container */}
          <motion.div
            initial={{ y: -50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-amber-900/10"
          >
            {/* Search Input Area */}
            <div className="flex items-center p-4 border-b border-gray-100">
              <Search className="w-6 h-6 text-muted-foreground ml-2 mr-4" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for jewelry, collections..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-xl font-medium placeholder:text-muted-foreground/60 text-foreground"
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              )}

              {!isLoading && query && results.length === 0 && (
                <div className="text-center py-12 px-6">
                  <p className="text-muted-foreground text-lg mb-2">No results found for "{query}"</p>
                  <p className="text-sm text-gray-400">Try adjusting your search or explore our collections.</p>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <ul className="py-2">
                  {results.map((product) => (
                    <li key={product.id}>
                      <button
                        onClick={() => handleSelectProduct(product.id)}
                        className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-amber-50/50 transition-colors group"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Gem className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-lg text-foreground truncate group-hover:text-amber-900 transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground truncate line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                        <div className="hidden sm:block text-right">
                          <span className="font-semibold text-foreground">₹{product.price.toFixed(2)}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {!query && (
                <div className="py-8 px-6 bg-gray-50/50">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Quick Links</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Rings', 'Necklaces', 'Earrings', 'Classic Indian'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium hover:border-accent hover:text-accent transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
