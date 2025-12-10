import { create } from 'zustand'
import { authService, User, LoginCredentials, RegisterCredentials } from '@/services/auth'

interface AuthState {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
	login: (credentials: LoginCredentials) => Promise<boolean>
	register: (credentials: RegisterCredentials) => Promise<boolean>
	logout: () => Promise<void>
	loadStoredAuth: () => Promise<void>
	clearError: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,

	login: async (credentials) => {
		set({ isLoading: true, error: null })
		try {
			const response = await authService.login(credentials)
			set({
				user: response.user,
				isAuthenticated: true,
				isLoading: false,
			})
			console.log('✅ Login successful:', response.user.email)
			return true
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Login failed'
			set({ error: message, isLoading: false })
			console.error('❌ Login failed:', message)
			return false
		}
	},

	register: async (credentials) => {
		set({ isLoading: true, error: null })
		try {
			const response = await authService.register(credentials)
			set({
				user: response.user,
				isAuthenticated: true,
				isLoading: false,
			})
			console.log('✅ Registration successful:', response.user.email)
			return true
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Registration failed'
			set({ error: message, isLoading: false })
			console.error('❌ Registration failed:', message)
			return false
		}
	},

	logout: async () => {
		await authService.logout()
		set({
			user: null,
			isAuthenticated: false,
			error: null,
		})
		console.log('👋 Logged out')
	},

	loadStoredAuth: async () => {
		set({ isLoading: true })
		try {
			const isAuth = await authService.isAuthenticated()
			if (isAuth) {
				const user = await authService.getStoredUser()
				set({
					user,
					isAuthenticated: true,
					isLoading: false,
				})
				console.log('🔐 Restored auth session:', user?.email)
			} else {
				set({ isLoading: false })
			}
		} catch (error) {
			set({ isLoading: false })
		}
	},

	clearError: () => set({ error: null }),
}))

export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)

