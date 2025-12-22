"use client"

import * as React from "react"
import { SidebarInset } from "@/components/Sidebar/SidebarComponents"
import Authentication from "@/components/Authentication"
import useGetPopups from "@/hooks/useGetPopups"
import useGetApplications from "@/hooks/useGetApplications"
import { BackofficeSidebar } from "@/components/Sidebar/Sidebar"
import HeaderBar from "@/components/Sidebar/HeaderBar"
import Providers from "../../components/Providers"
import { useGetPoaps } from "@/hooks/useGetPoaps"
import { usePathname, useParams } from "next/navigation"
import { PopupTheme } from "@/components/PopupTheme"
import { getPopupBranding } from "@/constants/popupBranding"

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const params = useParams()
  const isProfilePage = pathname === '/portal/profile'
  
  // Get popup slug from URL path (e.g., /portal/ripple-on-the-nile)
  const popupSlug = params.popupSlug as string | undefined
  const branding = getPopupBranding(popupSlug || null)

  return (
    <Providers>
      <PopupTheme colors={branding.colors}>
        <Authentication>
          <RootGets/>
          <div className="flex min-h-screen w-[100%]">
            <BackofficeSidebar collapsible="icon" />
            <SidebarInset>
              {!isProfilePage && <HeaderBar/>}
              <main className="flex-1 w-[100%] bg-muted">
                {children}
              </main>
            </SidebarInset>
          </div>
        </Authentication>
      </PopupTheme>
    </Providers>
  )
}

const RootGets = () => {
  useGetApplications()
  useGetPopups()
  useGetPoaps()
  return null
}

