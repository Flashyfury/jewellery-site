import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { toast } from "sonner"

export function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success("Signed in successfully!")
      navigate("/admin")
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="relative z-10 bg-background border border-border p-8 md:p-12 rounded-3xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-serif mb-2 text-center">Admin Login</h1>
        <p className="text-muted-foreground text-center text-sm mb-8">Sign in to access the dashboard</p>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@example.com" 
            />
          </div>
          <div>
             <label className="text-sm font-medium mb-1 block">Password</label>
             <Input 
               type="password" 
               required 
               value={password} 
               onChange={(e) => setPassword(e.target.value)} 
               placeholder="••••••••" 
             />
          </div>
          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-foreground/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
      </div>
    </div>
  )
}
