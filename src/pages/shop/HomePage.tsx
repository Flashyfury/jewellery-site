import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import type { Category } from '../../types'
import { Sparkles, ArrowRight, Diamond, Star, Gem, Leaf, Shield } from 'lucide-react'

const heroImages: Record<string, string> = {
  rings: '/images/category_ring_1_1772952763774.png',
  necklaces: '/images/floating_necklace_1772919070657.png',
  earrings: '/images/floating_earrings_1772919189881.png',
  bracelets: '/images/category_ring_2_1772952780620.png',
}

// Decorative sparkle particle positions
const particles = [
  { x: '10%', y: '20%', delay: 0, size: 6 },
  { x: '85%', y: '15%', delay: 1.2, size: 4 },
  { x: '70%', y: '65%', delay: 0.5, size: 8 },
  { x: '25%', y: '75%', delay: 2, size: 5 },
  { x: '55%', y: '30%', delay: 1.8, size: 3 },
  { x: '90%', y: '80%', delay: 0.8, size: 6 },
  { x: '15%', y: '50%', delay: 1.5, size: 4 },
  { x: '40%', y: '85%', delay: 2.5, size: 7 },
]

const categoryGradients = [
  'from-rose-900/30 via-red-900/10 to-transparent',
  'from-emerald-900/30 via-green-900/10 to-transparent',
  'from-amber-900/30 via-orange-900/10 to-transparent',
  'from-slate-900/30 via-blue-900/10 to-transparent',
]

const categoryAccents = [
  { border: 'group-hover:border-rose-800/50', glow: 'group-hover:shadow-[0_0_30px_rgba(159,18,57,0.15)]' },
  { border: 'group-hover:border-emerald-800/50', glow: 'group-hover:shadow-[0_0_30px_rgba(6,95,70,0.15)]' },
  { border: 'group-hover:border-amber-700/50', glow: 'group-hover:shadow-[0_0_30px_rgba(180,83,9,0.15)]' },
  { border: 'group-hover:border-slate-700/50', glow: 'group-hover:shadow-[0_0_30px_rgba(51,65,85,0.15)]' },
]

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => { if (data) setCategories(data) })
  }, [])

  return (
    <div className="relative w-full overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity }}
        className="relative min-h-[100dvh] md:min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 animated-gradient-bg" />

        {/* Radial color accents - Deep Indian Jewel Tones */}
        <div className="absolute top-[-20%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-br from-rose-900/15 to-red-950/10 blur-3xl opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full bg-gradient-to-br from-amber-700/15 to-orange-900/10 blur-3xl opacity-60" />
        <div className="absolute top-[40%] right-[20%] w-[150px] md:w-[300px] h-[150px] md:h-[300px] rounded-full bg-gradient-to-br from-emerald-900/15 to-teal-950/10 blur-3xl opacity-70" />

        {/* Floating sparkle particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-amber-500/70 to-yellow-600/50"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, -10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        ))}

        {/* Gradient overlay to background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />

        {/* Floating Jewelry Images */}
        <motion.div style={{ scale: heroScale }} className="absolute inset-0 z-0">
          <motion.img
            src="/images/floating_necklace_1772919070657.png"
            alt="Silver Necklace"
            className="absolute top-[15%] left-[5%] w-36 md:w-96 opacity-30 md:opacity-50 mix-blend-multiply object-contain"
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.img
            src="/images/floating_earrings_1772919189881.png"
            alt="Gold Earrings"
            className="absolute bottom-[15%] right-[5%] w-32 md:w-80 opacity-25 md:opacity-50 mix-blend-multiply object-contain"
            animate={{
              y: [0, 40, 0],
              x: [0, -20, 0],
              rotate: [0, -10, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          <motion.img
            src="/images/floating_ring_1772919473301.png"
            alt="Diamond Ring"
            className="absolute top-[20%] right-[10%] w-40 md:w-64 opacity-40 mix-blend-multiply object-contain hidden md:block"
            animate={{
              y: [0, 20, 0],
              x: [0, 20, 0],
              rotate: [0, 15, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </motion.div>

        {/* Hero Content */}
        <div className="container relative z-20 mx-auto px-5 md:px-6 py-10 md:py-20 flex flex-col items-center text-center">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full glass mb-6 md:mb-8 border border-amber-600/30 bg-background/40 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] md:tracking-[0.3em] uppercase text-foreground/90">Heritage Collection</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="text-[2.5rem] leading-[1.15] sm:text-5xl md:text-7xl lg:text-8xl md:leading-[1.1] font-serif mb-5 md:mb-8 max-w-4xl tracking-tight text-foreground"
          >
            Elegance Rooted in <br />
            <span className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent italic font-light drop-shadow-sm">Tradition.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-xl mx-auto text-base md:text-xl mb-8 md:mb-12 text-muted-foreground font-light leading-relaxed px-2 md:px-0"
          >
            Intricate karigari meets timeless sophistication. Fine jewelry born from deep-rooted cultural heritage and masterful craftsmanship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto"
          >
            <Link
              to="/shop"
              className="group relative inline-flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 font-medium text-white bg-gradient-to-r from-foreground via-foreground to-foreground/90 rounded-full overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(212,165,116,0.4)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2 text-neutral-900 text-sm md:text-base">
                Shop The Drop
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/collections/rings"
              className="group inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 md:py-5 font-medium text-foreground rounded-full border border-border/60 hover:border-amber-700/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(180,83,9,0.2)] glass bg-background/50 backdrop-blur-sm text-sm md:text-base"
            >
              <Diamond className="w-4 h-4 text-amber-700 group-hover:rotate-12 transition-transform" />
              Explore Collections
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-10 md:mt-16 text-[10px] md:text-xs text-muted-foreground/70 uppercase tracking-wider md:tracking-widest"
          >
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Handcrafted</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Ethically Sourced</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Minimal Shipping Charge</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-24 bg-background relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-50 border border-amber-200/50 mb-6"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-700">Shop by Category</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-6xl font-serif text-foreground"
            >
              Curated <span className="text-amber-700 italic font-light drop-shadow-sm">With Elegance</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.length === 0
              ? [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-muted/30 rounded-[2rem] aspect-[3/4]" />
              ))
              : categories.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={`/collections/${cat.slug}`}
                    className={`group relative block aspect-[3/4] rounded-[2rem] overflow-hidden border-2 border-transparent transition-all duration-500 ${categoryAccents[i % 4].border} ${categoryAccents[i % 4].glow}`}
                  >
                    {/* Image */}
                    <img
                      src={cat.hero_image_url || heroImages[cat.slug] || ''}
                      alt={cat.name}
                      className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />

                    {/* Gradient color overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${categoryGradients[i % 4]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* Dark gradient at bottom */}
                    <div className="absolute inset-0 category-card-overlay" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                      <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">Collection</p>
                      <p className="text-white text-2xl font-serif">{cat.name}</p>
                    </div>

                    {/* Hover CTA */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 bg-background/5 backdrop-blur-[2px]">
                      <motion.span
                        className="flex items-center gap-2 bg-white text-foreground text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full shadow-xl"
                        whileHover={{ scale: 1.05 }}
                      >
                        Explore <ArrowRight className="w-3 h-3" />
                      </motion.span>
                    </div>
                  </Link>
                </motion.div>
              ))
            }
          </div>
        </div>
      </section>

      {/* ===== FEATURES / TRUST BANNER ===== */}
      <section className="py-20 relative overflow-hidden bg-rose-950 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-500/20 to-transparent rounded-tl-full" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Gem, title: 'Master Karigars', desc: 'Crafted by artisans with generations of expertise', gradient: 'from-amber-200 to-amber-400', color: 'text-amber-300' },
              { icon: Leaf, title: 'Ethically Sourced', desc: 'Purity and sustainability in every precious stone', gradient: 'from-amber-200 to-amber-400', color: 'text-amber-300' },
              { icon: Shield, title: 'Heritage Guarantee', desc: 'Timeless quality designed to be passed down', gradient: 'from-amber-200 to-amber-400', color: 'text-amber-300' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center group"
              >
                <motion.div
                  className="text-4xl mb-4 inline-flex items-center justify-center p-4 rounded-full glass bg-white/5 border border-white/10 shadow-xl"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </motion.div>
                <h3 className={`text-lg font-serif mb-2 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50 max-w-xs mx-auto">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
