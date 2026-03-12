import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'

export function AdminNotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isAdmin } = useAuth();
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

  useEffect(() => {
    if (!isLoaded || !user) return;

    if (!isAdmin) return;

    // Listen for new orders
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('New Order Received!', payload)
          toast.success(`New Order Received!`, {
            description: `Order from ${payload.new.customer_name} for $${payload.new.total_amount}.`,
            duration: 8000,
          })
          
          // Note: In a production environment, you would trigger an email from your backend or Edge Function here.
          // For client-side, you could integrate EmailJS: emailjs.send(...)
          console.log("simulating email notification to admin...", ADMIN_EMAIL)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, isLoaded, ADMIN_EMAIL])

  return <>{children}</>
}
