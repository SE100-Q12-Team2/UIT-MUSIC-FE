import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]",
  {
    variants: {
      variant: {
        default:
          "bg-[#f8e04c] text-black shadow-[0_0_30px_rgba(248,224,76,0.35)] hover:bg-[#ffe066]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400/50",
        outline:
          "border border-white/50 bg-transparent text-white hover:bg-white/10",
        secondary: "bg-white/15 text-white hover:bg-white/25",
        ghost: "text-[#f8e04c] hover:text-white",
        link: "text-[#f8e04c] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 gap-1.5 px-4 text-xs",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
