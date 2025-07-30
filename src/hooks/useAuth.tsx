import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

interface User {
  id: string
  login: string
  avatarUrl: string
  email: string
  isOwner: boolean
}

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  login: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const currentUser = await spark.user()
      if (currentUser && currentUser.login) {
        setUser(currentUser)
      }
    } catch (error) {
      console.log('No authenticated user')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async () => {
    setIsLoginLoading(true)
    try {
      // In a real implementation, this would trigger GitHub OAuth flow
      // For now, we'll simulate getting the user info
      const currentUser = await spark.user()
      if (currentUser && currentUser.login) {
        setUser(currentUser)
      } else {
        throw new Error('Authentication failed')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoginLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    // In a real implementation, this would clear auth tokens
    // and redirect to logout endpoint
  }

  return {
    user,
    isLoading: isLoading || isLoginLoading,
    login,
    logout,
    isAuthenticated: !!user
  }
}