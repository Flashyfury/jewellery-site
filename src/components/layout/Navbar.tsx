import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'

export function Navbar() {
  const { user, signOut } = useAuth()
  const isSignedIn = !!user
  const { cartCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
  ]

  const collectionLinks = [
    { name: '💍 Rings', href: '/collections/rings' },
    { name: '✨ Necklaces', href: '/collections/necklaces' },
    { name: '👂 Earrings', href: '/collections/earrings' },
    { name: '⭕ Bracelets', href: '/collections/bracelets' },
  ]

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-background/50 border-b border-border/40 transition-all duration-500">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif font-medium tracking-tight hover:opacity-80 transition-opacity z-50">
          Olivia's Exclusive.
        </Link>
        
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
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
              <div className="bg-background border border-border rounded-2xl shadow-xl p-2 w-48 flex flex-col gap-1">
                {collectionLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left normal-case tracking-normal text-xs"
                  >
                    {link.name}
                  </Link>
                ))}
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
            className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden flex flex-col h-screen"
          >
            <nav className="flex flex-col gap-6 text-2xl font-serif">
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
                  {collectionLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xl hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
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
    </header>
  )
}
