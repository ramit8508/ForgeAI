/**
 * ForgeAI — Page container
 *
 * Consistent padding, max-width, and spacing for all pages.
 * Every page should wrap its content in this component.
 */

import { cn } from '../../lib/utils'

function PageContainer({ children, className }) {
  return (
    <div className={cn('mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8', className)}>
      {children}
    </div>
  )
}

export default PageContainer
