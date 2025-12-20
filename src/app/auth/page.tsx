'use client'

import Quote from '@/app/auth/Quote'
import { Loader } from '@/components/ui/Loader'
import { PopupTheme } from '@/components/PopupTheme'
import { getPopupBranding } from '@/constants/popupBranding'
import useAuthentication from '@/hooks/useAuthentication'
import { usePopupSlug } from '@/hooks/usePopupSlug'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import ConsoleLogger from '@/components/ConsoleLogger'

// Dynamically import AuthForm with no SSR
const AuthForm = dynamic(() => import('@/app/auth/AuthForm'), {
  ssr: false,
})

function AuthContent() {
  const { login, token, isLoading, isAuthenticated } = useAuthentication()
  const router = useRouter()
  const popupSlug = usePopupSlug()
  const branding = getPopupBranding(popupSlug)

  const handleLogin = useCallback(async () => {
    const isLogged = await login()
    if(isLogged) {
      router.push(`/portal${popupSlug ? `/${popupSlug}` : ''}`)
    }
  }, [login, router, popupSlug])

  useEffect(() => {
    handleLogin()
  }, [handleLogin])

  if(isLoading || isAuthenticated || token) {
    return (
      <div className="w-full h-full">
        <Loader/>
      </div>
    )
  }

  return (
    <PopupTheme colors={branding.colors}>
      <div className="flex min-h-screen bg-background">
        <Quote />
        <AuthForm />
      </div>
    </PopupTheme>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-full">
        <Loader/>
      </div>
    }>
      {/* <ConsoleLogger /> */}
      <AuthContent />
    </Suspense>
  )
}

