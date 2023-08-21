'use client' //next-intl not available for SC.

import { useTranslations } from 'next-intl'

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage')

  return (
    <div>
      <h2>Page not found</h2>
    </div>
  )
}
