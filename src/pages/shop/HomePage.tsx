import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import type { Category } from '../../types'
import { ArrowRight, Gem, Leaf, Shield, Star, Droplets, Heart, ShieldCheck, Zap } from 'lucide-react'

const heroImages: Record<string, string> = {
  rings: '/images/category_ring_1_1772952763774.png',
  necklaces: '/images/floating_necklace_1772919070657.png',
  earrings: '/images/floating_earrings_1772919189881.png',
  bracelets: '/images/category_ring_2_1772952780620.png',
  'classic-indian': '/images/classic_indian_premium.png',
  'matching-set': '/images/matching_set_premium.png',
}



const categoryGradients = [
  'from-rose-900/30 via-red-900/10 to-transparent',
  'from-emerald-900/30 via-green-900/10 to-transparent',
  'from-amber-900/30 via-orange-900/10 to-transparent',
  'from-slate-900/30 via-blue-900/10 to-transparent',
  'from-orange-900/30 via-yellow-900/10 to-transparent',
  'from-pink-900/30 via-fuchsia-900/10 to-transparent',
]

const categoryAccents = [
  { border: 'group-hover:border-rose-800/50', glow: 'group-hover:shadow-[0_0_30px_rgba(159,18,57,0.15)]' },
  { border: 'group-hover:border-emerald-800/50', glow: 'group-hover:shadow-[0_0_30px_rgba(6,95,70,0.15)]' },
  { border: 'group-hover:border-amber-700/50', glow: 'group-hover:shadow-[0_0_30px_rgba(180,83,9,0.15)]' },
  { border: 'group-hover:border-slate-700/50', glow: 'group-hover:shadow-[0_0_30px_rgba(51,65,85,0.15)]' },
  { border: 'group-hover:border-orange-700/50', glow: 'group-hover:shadow-[0_0_30px_rgba(194,65,12,0.15)]' },
  { border: 'group-hover:border-pink-700/50', glow: 'group-hover:shadow-[0_0_30px_rgba(190,24,93,0.15)]' },
]

const categoryBgs = [
  'bg-gradient-to-br from-amber-100 via-stone-100 to-amber-50',
  'bg-gradient-to-br from-slate-100 via-gray-100 to-neutral-50',
  'bg-gradient-to-br from-stone-100 via-amber-50 to-yellow-50',
  'bg-gradient-to-br from-neutral-100 via-stone-100 to-gray-50',
  'bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-50',
  'bg-gradient-to-br from-pink-100 via-rose-50 to-fuchsia-50',
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
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-rose-50/30"
      >
        {/* Editorial Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50/90 via-rose-50/50 to-rose-50/90 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent z-10" />
          <motion.img
            src="/images/Oliviaexclusive_coverpic.png"
            alt="Olivia's Exclusive Background"
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
            style={{ scale: heroScale }}
          />
        </div>

        {/* Hero Content (Editorial Style) */}
        <div className="container relative z-20 mx-auto px-5 md:px-6 pt-32 pb-20 flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center md:items-start w-full max-w-3xl"
          >
            {/* Elegant Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mb-8 flex items-center gap-4"
            >
              <div className="h-[1px] w-8 md:w-12 bg-rose-300" />
              <span className="text-[10px] md:text-xs font-medium tracking-[0.4em] uppercase text-rose-900/70">
                Olivia's Exclusive
              </span>
              <div className="h-[1px] w-8 md:w-12 bg-rose-300 hidden md:block" />
            </motion.div>

            {/* Cinematic Headline */}
            <h1 className="text-[3.5rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05] font-serif mb-8 tracking-tight text-neutral-900">
              Timeless Shine, <br />
              <span className="italic font-light text-rose-800/90">Everyday You.</span>
            </h1>

            {/* Refined Description */}
            <p className="max-w-2xl text-base md:text-xl mb-14 text-neutral-600 font-light leading-relaxed tracking-wide">
              Premium handcrafted jewelry designed to resist discoloration, moisture, and sweat. Experience flawless radiance that lasts.
            </p>

            {/* Action Buttons - Minimalist */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start items-center w-full sm:w-auto mb-20">
              <Link
                to="/shop"
                className="group relative inline-flex items-center justify-center px-12 py-4 md:py-5 font-medium text-white bg-neutral-900 overflow-hidden transition-all duration-500 hover:bg-rose-900"
              >
                <span className="relative flex items-center gap-3 text-sm tracking-[0.2em] uppercase">
                  Discover Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                </span>
              </Link>
              <Link
                to="/our-story"
                className="group inline-flex items-center justify-center px-12 py-4 md:py-5 font-medium text-neutral-900 border border-neutral-900/20 hover:border-neutral-900 transition-all duration-500 bg-transparent"
              >
                <span className="text-sm tracking-[0.2em] uppercase">
                  Our Heritage
                </span>
              </Link>
            </div>

            {/* Minimalist Feature Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-12 lg:gap-16 w-full pt-10 border-t border-rose-200/50"
            >
              {[
                { icon: Droplets, label: 'Waterproof' },
                { icon: Zap, label: 'Sweat Proof' },
                { icon: ShieldCheck, label: 'Anti Tarnish' },
                { icon: Heart, label: 'Hypoallergenic' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <feature.icon className="w-4 h-4 text-rose-400 group-hover:text-rose-600 transition-colors duration-500" strokeWidth={1.5} />
                  <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 group-hover:text-neutral-900 transition-colors duration-500">
                    {feature.label}
                  </span>
                </div>
              ))}
            </motion.div>
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
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                    className={`group relative block aspect-[3/4] rounded-[2rem] overflow-hidden border-2 border-transparent transition-all duration-500 ${categoryBgs[i % 6]} ${categoryAccents[i % 6].border} ${categoryAccents[i % 6].glow}`}
                  >
                    {/* Image */}
                    <img
                      src={cat.hero_image_url || heroImages[cat.slug] || ''}
                      alt={cat.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover mix-blend-multiply transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />

                    {/* Gradient color overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${categoryGradients[i % 6]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

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
