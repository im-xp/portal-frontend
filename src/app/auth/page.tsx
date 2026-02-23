import { Suspense } from 'react'
import { headers } from 'next/headers'
import { Loader } from '@/components/ui/Loader'
import { resolvePopupSlugFromHost } from '@/lib/domainPopup'
import AuthContent from './AuthContent'

export default async function AuthPage() {
  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || ''
  const popupSlug = resolvePopupSlugFromHost(host)

  return (
    <Suspense fallback={
      <div className="w-full h-full">
        <Loader/>
      </div>
    }>
      <AuthContent popupSlug={popupSlug} />
    </Suspense>
  )
}
