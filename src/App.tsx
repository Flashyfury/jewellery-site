import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'sonner'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/shop/HomePage'
import { ShopPage } from './pages/shop/ShopPage'
import { ProductDetailsPage } from './pages/shop/ProductDetailsPage'
import { CheckoutPage } from './pages/shop/CheckoutPage'
import { CollectionPage } from './pages/shop/CollectionPage'
import { SignInPage } from './pages/auth/SignInPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminRoute } from './components/layout/AdminRoute'
import { AdminNotificationProvider } from './components/layout/AdminNotificationProvider'
import { CartProvider } from './context/CartContext'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AdminNotificationProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster position="top-center" richColors />
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:id" element={<ProductDetailsPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/collections/:category" element={<CollectionPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                
                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </Layout>
          </BrowserRouter>
        </CartProvider>
      </AdminNotificationProvider>
    </AuthProvider>
  )
}

export default App
