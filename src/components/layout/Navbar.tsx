import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ShoppingBag, Menu, X, ChevronDown, Gem, Sparkles, Star, Circle, Home, Crown, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { SearchModal } from '../ui/SearchModal'
import { Search } from 'lucide-react'

const IconMap: Record<string, any> = {
  Gem: Gem,
  Sparkles: Sparkles,
  Star: Star,
  Circle: Circle,
  Crown: Crown,
  Heart: Heart
}

export function Navbar() {
  const { user, signOut } = useAuth()
  const isSignedIn = !!user
  const { cartCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen, isSearchOpen])

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
  ]

  const collectionLinks = [
    { name: 'Rings', href: '/collections/rings', icon: 'Gem' },
    { name: 'Necklaces', href: '/collections/necklaces', icon: 'Sparkles' },
    { name: 'Earrings', href: '/collections/earrings', icon: 'Star' },
    { name: 'Bracelets', href: '/collections/bracelets', icon: 'Circle' },
    { name: 'Classic Indian', href: '/collections/classic-indian', icon: 'Crown' },
    { name: 'Matching Set', href: '/collections/matching-set', icon: 'Heart' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 md:px-6 pt-3 md:pt-4 transition-all duration-500">
      <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex justify-between items-center rounded-full bg-amber-950/10 backdrop-blur-2xl border border-amber-400/20 shadow-[0_4px_30px_rgba(212,165,116,0.12)]">
        {/* Logo        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Search Button */}
          <button
            title="Search"
            onClick={() => setIsSearchOpen(true)}
            className="p-2 -mr-1 hover:bg-amber-900/10 hover:text-amber-800 rounded-full transition-colors relative"
          >
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <Link to="/" className="text-2xl font-serif font-medium tracking-tight hover:opacity-80 transition-opacity z-50">
            Olivia's Exclusive.
          </Link>
          {!isHomePage && (
            <Link to="/" className="hidden md:flex p-2 hover:bg-amber-900/10 hover:text-amber-800 rounded-full transition-colors text-foreground/80" title="Back to Home">
              <Home className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground items-center">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.href} className="group relative hover:text-foreground transition-colors py-2">
              {link.name}
              <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-accent transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
            </Link>
          ))}
          {/* Collections Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-foreground transition-colors py-2">
              Collections <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out">
              <div className="bg-white/95 backdrop-blur-xl border border-neutral-200 rounded-2xl shadow-2xl p-2 w-48 flex flex-col gap-1">

                {collectionLinks.map((link) => {
                  const Icon = IconMap[link.icon]
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left normal-case tracking-normal text-xs flex items-center gap-2 group/link"
                    >
                      {Icon && (
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-4 h-4 text-accent/70 group-hover/link:text-accent transition-colors" />
                        </motion.div>
                      )}
                      {link.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          {isSignedIn && (
            <button onClick={signOut} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign Out</button>
          )}
          <Link to="/checkout" className="relative p-2 hover:bg-muted rounded-full transition-colors group">
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden z-50">
          <Link to="/checkout" className="relative p-2 hover:bg-muted rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl pt-20 px-6 md:hidden flex flex-col h-[100dvh]"
          >
            <nav className="flex flex-col gap-6 text-2xl font-serif">
              {!isHomePage && (
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-amber-700 transition-colors border-b border-border/50 pb-4 flex items-center gap-3 text-amber-900/80"
                >
                  <Home className="w-5 h-5" /> Home
                </Link>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-accent transition-colors border-b border-border pb-4"
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-b border-border pb-4">
                <p className="text-base font-sans uppercase tracking-widest text-muted-foreground mb-3">Collections</p>
                <div className="flex flex-col gap-3">
                  {collectionLinks.map((link) => {
                    const Icon = IconMap[link.icon]
                    return (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xl hover:text-accent transition-colors flex items-center gap-3"
                      >
                        {Icon && (
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Icon className="w-5 h-5 text-accent/80" />
                          </motion.div>
                        )}
                        {link.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
              {isSignedIn && (
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <span className="text-base font-sans truncate pr-4">{user?.email}</span>
                  <button onClick={() => { signOut(); setIsMobileMenuOpen(false) }} className="text-sm text-red-500">Sign Out</button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
