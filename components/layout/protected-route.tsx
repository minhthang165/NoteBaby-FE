"use client"

/**
 * ProtectedRoute component
 * 
 * This component provides authentication protection for routes that require users to be logged in.
 * It checks for a valid JWT token and redirects unauthenticated users to the sign-in page.
 * 
 * Usage:
 * <ProtectedRoute>
 *   <YourComponent />
 * </ProtectedRoute>
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDataFromJWT } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get data from JWT (from URL params, localStorage, or cookies)
        const data = getDataFromJWT()
        
        if (data) {
          // User is authenticated
          setIsAuthorized(true)
        } else {
          // User is not authenticated, redirect to login
          console.log("No authentication data found, redirecting to sign-in")
          setIsAuthorized(false)
          router.push('/sign-in')
        }
      } catch (error) {
        console.error("Authentication error:", error)
        setIsAuthorized(false)
        router.push('/sign-in')
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authentication
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    )
  }

  // If authorized, render the children
  return isAuthorized ? <>{children}</> : null
}