import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Diamond, Shield, Heart, ArrowRight } from 'lucide-react'

export function OurStoryPage() {
  return (
    <div className="relative w-full overflow-hidden bg-background">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-24 md:pt-32 pb-16">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animated-gradient-bg opacity-30" />
        
        {/* Decorative Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-br from-amber-700/15 to-orange-900/10 blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] rounded-full bg-gradient-to-br from-rose-900/15 to-red-950/10 blur-3xl opacity-70" />

        <div className="container relative z-20 mx-auto px-5 md:px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full glass mb-6 border border-amber-600/30 bg-background/40 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-foreground/90">Our Heritage</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="text-[2.5rem] leading-[1.15] sm:text-5xl md:text-7xl font-serif mb-6 max-w-4xl tracking-tight text-foreground"
          >
            Crafting Memories That <br />
            <span className="bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent italic font-light drop-shadow-sm">Last a Lifetime.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-2xl mx-auto text-base md:text-xl text-muted-foreground font-light leading-relaxed px-2 md:px-0"
          >
            At Olivia's Exclusive, we believe fine jewelry is more than an accessory—it is a legacy. We specialize in exquisite, heirloom-quality pieces designed to transcend time and generations.
          </motion.p>
        </div>
      </section>

      {/* ===== CRAFTSMANSHIP & ANTI-TARNISH SECTION ===== */}
      <section className="py-20 md:py-32 bg-stone-50/50 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden"
            >
              <img
                src="/images/matching_set_premium.png"
                alt="Detailed craftsmanship of heirloom jewelry"
                className="w-full h-full object-cover mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-3xl md:text-5xl font-serif text-foreground">
                The Art of <span className="text-amber-700 italic font-light">Purity</span>
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed text-lg">
                Every piece in our collection is a testament to meticulous artistry and uncompromising quality. We proudly offer <strong className="font-medium text-foreground">anti-tarnish accessories</strong> that maintain their brilliant luster through monsoons, mornings, and all the moments in between.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-1">Anti-Tarnish</h3>
                    <p className="text-sm text-muted-foreground">Advanced protective finishing ensures your jewelry stays exquisite, resisting oxidation and wear.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Diamond className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-1">Heirloom Quality</h3>
                    <p className="text-sm text-muted-foreground">Hand-finished designs crafted with the intention of becoming cherished family heirlooms.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FOUNDER / BRAND HISTORY SECTION ===== */}
      <section className="py-20 md:py-32 relative bg-rose-950 text-white overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-8 backdrop-blur-sm border border-white/20"
            >
              <Heart className="w-8 h-8 text-amber-400" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-serif mb-8"
            >
              The Vision Behind <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent italic">The Sparkle</span>
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6 text-lg md:text-xl text-white/80 font-light leading-relaxed"
            >
              <p>
                Olivia's Exclusive was born from a simple yet profound desire: to create beautiful, high-end jewelry that endures. After years of witnessing cherished pieces lose their luster, our founder set out to perfect a crafting process that combined traditional artistry with modern resilience.
              </p>
              <p>
                Today, our brand stands as a symbol of accessible luxury and enduring beauty. By merging classic aesthetics with our proprietary anti-tarnish technology, we ensure that every piece you wear remains as flawless as the day you first put it on. It's not just jewelry; it's a piece of history you can wear every day.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 relative overflow-hidden bg-background">
        {/* Glow behind CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-amber-100/40 to-rose-100/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-serif mb-6 text-foreground"
          >
            Begin Your <span className="text-amber-700 italic font-light">Legacy</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground font-light mb-10 max-w-xl mx-auto"
          >
            Discover our collection of heirloom-quality, anti-tarnish jewelry designed to accompany you through every chapter of life.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/shop"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 font-medium text-white bg-gradient-to-r from-foreground via-foreground to-foreground/90 rounded-full overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(212,165,116,0.4)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2 text-neutral-900">
                Explore Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
