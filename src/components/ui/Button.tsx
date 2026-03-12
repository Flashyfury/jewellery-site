import * as React from "react"
import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
import { cn } from "../../lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "accent"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {

    const baseClass = "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      default: "bg-foreground text-background shadow hover:bg-foreground/90",
      accent: "bg-accent text-white shadow-sm hover:bg-accent-hover",
      outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-white hover:border-accent",
      ghost: "hover:bg-accent/10 hover:text-accent",
      link: "text-primary underline-offset-4 hover:underline",
    }

    const sizes = {
      default: "h-11 px-6 py-2",
      sm: "h-8 rounded-full px-3 text-xs",
      lg: "h-14 rounded-full px-10 text-base",
      icon: "h-11 w-11",
    }

    const Comp = motion.button

    // Convert generic react button props to framer motion props
    const motionProps = props as HTMLMotionProps<"button">

    return (
      <Comp
        ref={ref}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        className={cn(baseClass, variants[variant], sizes[size], className)}
        {...motionProps}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
