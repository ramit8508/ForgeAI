import { cn } from '../../lib/utils'

function Card({ children, className, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-lg border border-border bg-card text-card-foreground shadow-subtle transition-colors',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Card
