import { usePathname, useRouter } from "next/navigation"
import useResources from "../hooks/useResources"
import { useEffect } from "react"

const Permissions = ({children}: {children: React.ReactNode}) => {
  const route = usePathname()
  const router = useRouter()
  const { resources, isLoading } = useResources()

  // Check if route matches exactly or is a nested route under an active resource
  const isAuthorized = resources.some(resource => {
    if (resource.status !== 'active') return false
    // Exact match
    if (resource.path === route) return true
    // Nested route match (e.g., /portal/ripple/attendees/123 under /portal/ripple/attendees)
    if (route.startsWith(resource.path + '/')) return true
    return false
  })
  
  useEffect(() => {
    // Don't redirect while data is still loading
    if (isLoading) return
    if (isAuthorized) return
    router.push('/portal')
  }, [route, router, isAuthorized, isLoading])

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isAuthorized) {
    return children
  }
  return <div>You are not authorized to access this page</div>
}
export default Permissions