import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex col-span-1 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-mat-wine text-mat-cream shadow hover:bg-mat-wine/80",
        secondary:
          "border-transparent bg-mat-rose text-mat-cream hover:bg-mat-rose/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground border-mat-rose/20 text-mat-wine",
        gold: "bg-mat-gold text-mat-wine border-mat-gold/30 shadow-mat-gold uppercase font-black tracking-widest text-[9px] italic py-1 px-4",
        rose: "bg-mat-rose/10 text-mat-rose border-mat-rose/20 uppercase font-black tracking-widest text-[9px] italic py-1 px-4",
        sovereign: "bg-mat-wine/5 text-mat-wine border-mat-wine/10 uppercase font-black tracking-widest text-[9px] italic py-1 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
