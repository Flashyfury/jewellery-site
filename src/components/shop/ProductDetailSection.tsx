import { motion } from 'framer-motion'
import { MessageCircle, Instagram, ShoppingBag } from 'lucide-react'

interface ProductDetailSectionProps {
  id: string
  name: string
  price: number
  material?: string
  stock: number
  image: string
  categoryName?: string
  description?: string
  whatsappNumber?: string
  instagramLink?: string
  onAddToCart: () => void
}

export function ProductDetailSection({
  name,
  price,
  material = "Anti-tarnish premium brass with gold/rose-gold plating",
  stock,
  image,
  categoryName = "EXCLUSIVE",
  description,
  whatsappNumber = "+916289682863",
  instagramLink = "https://www.instagram.com/olivesxlusive?igsh=dGRpbW5ncjNrem8w&utm_source=qr",
  onAddToCart
}: ProductDetailSectionProps) {
  
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(`Hi, I'm interested in ${name}`)
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank')
  }

  const handleInstagramClick = () => {
    window.open(instagramLink, '_blank')
  }

  return (
    <div className="w-full bg-white">
      <div className="flex flex-col lg:flex-row min-h-[85vh]">
        {/* Left: Product Image */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 bg-[#f8f8f8] flex items-center justify-center p-8 lg:p-16"
        >
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-full max-w-md object-contain mix-blend-multiply"
            />
          ) : (
            <div className="w-full aspect-[4/5] max-w-md flex items-center justify-center text-stone-400 font-serif italic text-xl border border-stone-200">
              Image coming soon
            </div>
          )}
        </motion.div>

        {/* Right: Product Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-1/2 p-8 lg:p-16 xl:px-24 flex flex-col justify-center"
        >
          <div className="max-w-xl">
            {/* Category */}
            <div className="mb-4">
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.2em] text-stone-500 uppercase">
                {categoryName}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-900 leading-tight tracking-tight mb-4">
              {name}
            </h1>

            {/* Price */}
            <p className="text-xl sm:text-2xl text-stone-800 font-medium mb-8">
              ₹{price.toFixed(2)}
            </p>

            {/* Divider */}
            <div className="h-[1px] w-full bg-stone-200 mb-8" />

            {/* Material & Description */}
            <div className="space-y-4 mb-8">
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                <strong className="font-medium text-stone-900">Material:</strong> {material}
              </p>
              {description && (
                <p className="text-sm text-stone-600 font-light leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-8">
              {stock <= 0 ? (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-red-800 bg-red-50 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Sold Out
                </span>
              ) : stock <= 5 ? (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Only {stock} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In stock
                </span>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pb-24 lg:pb-0">
              <button
                onClick={onAddToCart}
                disabled={stock <= 0}
                className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-stone-100 text-stone-900 border border-transparent font-medium hover:bg-stone-200 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShoppingBag className="w-4 h-4" />
                {stock > 0 ? 'ADD TO BAG' : 'OUT OF STOCK'}
              </button>

              <button
                onClick={handleWhatsAppClick}
                className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-black text-white font-medium hover:bg-neutral-800 hover:scale-[1.02] transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
              >
                <MessageCircle className="w-4 h-4" />
                ENQUIRE ON WHATSAPP
              </button>

              <button
                onClick={handleInstagramClick}
                className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-white text-black border border-black font-medium hover:bg-stone-50 hover:scale-[1.02] transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
                DM ON INSTAGRAM
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Sticky CTAs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-stone-200 z-40 flex gap-2">
        <button
          onClick={handleWhatsAppClick}
          className="flex-1 flex items-center justify-center py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WHATSAPP
        </button>
        <button
          onClick={handleInstagramClick}
          className="flex-1 flex items-center justify-center py-3.5 rounded-full bg-white text-black border border-black text-sm font-medium hover:bg-stone-50 transition-colors"
        >
          <Instagram className="w-4 h-4 mr-2" />
          INSTAGRAM
        </button>
      </div>
    </div>
  )
}
