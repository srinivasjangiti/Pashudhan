import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // New default liquid glass style - Apple Blue theme
        default: "rounded-xl text-white font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-br from-[#007AFF] via-[#0051D5] to-[#003D82] shadow-[0_0_8px_rgba(0,122,255,0.3),0_4px_12px_rgba(0,122,255,0.2),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(0,122,255,0.6),0_10px_25px_rgba(0,122,255,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] border border-white/20 backdrop-blur-sm",
        
        // Green variant for nature/success actions
        nature: "rounded-xl text-white font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-br from-[#34D399] via-[#10B981] to-[#059669] shadow-[0_0_8px_rgba(52,211,153,0.3),0_4px_12px_rgba(52,211,153,0.2),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(52,211,153,0.6),0_10px_25px_rgba(52,211,153,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] border border-white/20 backdrop-blur-sm",
        
        // Purple variant for special actions
        purple: "rounded-xl text-white font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] shadow-[0_0_8px_rgba(139,92,246,0.3),0_4px_12px_rgba(139,92,246,0.2),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.6),0_10px_25px_rgba(139,92,246,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] border border-white/20 backdrop-blur-sm",
        
        // Ghost style with glass effect
        ghost: "rounded-xl text-white hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-black/30 hover:bg-black/40 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-white/5",
        
        // Destructive red variant
        destructive: "rounded-xl text-white font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-br from-[#EF4444] via-[#DC2626] to-[#B91C1C] shadow-[0_0_8px_rgba(239,68,68,0.3),0_4px_12px_rgba(239,68,68,0.2),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6),0_10px_25px_rgba(239,68,68,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] border border-white/20 backdrop-blur-sm",
        
        // Outline with glass effect  
        outline: "rounded-xl text-white hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-transparent hover:bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 shadow-lg",
        
        // Link style
        link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300 transition-colors",
        
        // Legacy variants for compatibility
        secondary: "rounded-xl text-white font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 shadow-[0_0_8px_rgba(107,114,128,0.3),0_4px_12px_rgba(107,114,128,0.2),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(107,114,128,0.6),0_10px_25px_rgba(107,114,128,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] border border-white/20 backdrop-blur-sm",
        
        hero: "rounded-xl text-white font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-br from-[#007AFF] via-[#0051D5] to-[#003D82] shadow-[0_0_8px_rgba(0,122,255,0.3),0_4px_12px_rgba(0,122,255,0.2),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(0,122,255,0.6),0_10px_25px_rgba(0,122,255,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] border border-white/20 backdrop-blur-sm",
        
        upload: "rounded-xl text-white font-semibold hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-br from-[#007AFF] via-[#0051D5] to-[#003D82] shadow-[0_0_8px_rgba(0,122,255,0.3),0_4px_12px_rgba(0,122,255,0.2),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(0,122,255,0.6),0_10px_25px_rgba(0,122,255,0.4),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)] border border-white/20 backdrop-blur-sm",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-lg",
        xl: "h-14 px-10 text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Check if this is a liquid glass variant (not link or outline-only variants)
    const hasGlassEffect = variant !== "link" && variant !== "outline"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), "relative overflow-hidden", className)}
        ref={ref}
        {...props}
      >
        {/* Glass effect overlay for liquid glass variants */}
        {hasGlassEffect && (
          <>
            {/* Inner glass shine */}
            <div className="absolute top-0 left-0 h-full w-full rounded-xl bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none z-0" />
            
            {/* Glass morphism blur effect */}
            <div
              className="absolute top-0 left-0 h-full w-full rounded-xl pointer-events-none z-0"
              style={{ backdropFilter: 'blur(8px) saturate(180%)' }}
            />
          </>
        )}
        
        {/* Content with proper z-index and flex layout */}
        <div className="relative z-20 flex items-center justify-center gap-2 w-full h-full drop-shadow-sm">
          {children}
        </div>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
