/**
 * ForgeAI — Page header
 *
 * Consistent page header with breadcrumb, eyebrow tag, title,
 * description, and an optional actions slot.
 */

function PageHeader({ breadcrumb, tag, title, description, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {breadcrumb && (
          <nav
            className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <span>ForgeAI</span>
            <span aria-hidden="true">/</span>
            <strong className="text-foreground">{breadcrumb}</strong>
          </nav>
        )}
        {tag && (
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
            {tag}
          </span>
        )}
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}

export default PageHeader
