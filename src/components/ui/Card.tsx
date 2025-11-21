import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass'
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', hover = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl p-6'

    const variants = {
      default: 'bg-dark-card border border-white/5',
      glass: 'glass-card',
    }

    const hoverStyles = hover ? 'hover:border-primary-teal/50 hover:shadow-lg hover:shadow-primary-teal/10 transition-all duration-300 cursor-pointer' : ''

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
