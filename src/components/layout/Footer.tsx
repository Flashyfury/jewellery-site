import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="py-16 border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="text-3xl font-serif tracking-tight mb-4">Olivia's Exclusive.</div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Curated statement pieces for the bold and beautiful. Handcrafted with precision, worn with attitude.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/collections/rings" className="hover:text-foreground transition-colors">Rings</Link></li>
              <li><Link to="/collections/necklaces" className="hover:text-foreground transition-colors">Necklaces</Link></li>
              <li><Link to="/collections/earrings" className="hover:text-foreground transition-colors">Earrings</Link></li>
              <li><Link to="/collections/bracelets" className="hover:text-foreground transition-colors">Bracelets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border">
          <div className="text-sm text-muted-foreground font-medium flex gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
            <span>© {new Date().getFullYear()} Olivia's Exclusive. Made with ❤️ by lmcxfury9@gmail.com</span>
            <Link to="/sign-in" className="hover:text-foreground transition-colors mix-blend-multiply opacity-50">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
