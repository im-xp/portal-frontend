'use client'

import Quote from '@/app/auth/Quote'
import { Loader } from '@/components/ui/Loader'
import { PopupTheme } from '@/components/PopupTheme'
import { getPopupBranding } from '@/constants/popupBranding'
import useAuthentication from '@/hooks/useAuthentication'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/app/auth/AuthForm'), {
  ssr: false,
})

interface AuthContentProps {
  popupSlug: string | null
}

export default function AuthContent({ popupSlug }: AuthContentProps) {
  const { login, token, isLoading, isAuthenticated } = useAuthentication()
  const router = useRouter()
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
        <Quote popupSlug={popupSlug} />
        <AuthForm popupSlug={popupSlug} />
      </div>
    </PopupTheme>
  )
}
