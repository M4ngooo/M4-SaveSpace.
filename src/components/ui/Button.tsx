import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'quick'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-accent text-bg font-semibold hover:bg-accent-hover active:scale-[0.98] glow-accent',
  secondary: 'bg-card border border-border text-text hover:bg-card-hover hover:border-border-light active:scale-[0.98]',
  ghost: 'text-text-secondary hover:text-text hover:bg-card-hover active:scale-[0.98]',
  danger: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 active:scale-[0.98]',
  quick: 'bg-accent/10 border border-accent/30 text-accent font-semibold hover:bg-accent/20 hover:border-accent/50 active:scale-[0.96]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
