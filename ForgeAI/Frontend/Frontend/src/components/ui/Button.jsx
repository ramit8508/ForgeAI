import { cn } from '../../lib/utils'

function Button({ children, variant = 'primary', className, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary',
        variant === 'primary' &&
          'bg-primary text-primary-foreground hover:bg-primary/85',
        variant === 'secondary' &&
          'border border-border-strong bg-transparent text-foreground hover:bg-accent',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
