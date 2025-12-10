import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const getApiBaseUrl = () => {
	if (!__DEV__) {
		return 'https://your-production-url.com/api'
	}
	if (Platform.OS === 'ios') {
		return 'http://localhost:3000/api'
	}
	return 'http://10.0.2.2:3000/api'
}

const API_BASE_URL = getApiBaseUrl()

const TOKEN_KEY = '@music_app_token'
const USER_KEY = '@music_app_user'

export interface User {
	id: string
	email: string
	name: string
	avatar?: string
}

export interface AuthResponse {
	accessToken: string
	user: User
}

export interface LoginCredentials {
	email: string
	password: string
}

export interface RegisterCredentials {
	email: string
	password: string
	name: string
}

const handleResponse = async <T>(response: Response): Promise<T> => {
	const data = await response.json()
	if (!response.ok) {
		throw new Error(data.message || `HTTP error! status: ${response.status}`)
	}
	return data
}

export const authService = {
	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(credentials),
		})
		const data = await handleResponse<AuthResponse>(response)
		await this.saveAuthData(data)
		return data
	},

	async register(credentials: RegisterCredentials): Promise<AuthResponse> {
		const response = await fetch(`${API_BASE_URL}/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(credentials),
		})
		const data = await handleResponse<AuthResponse>(response)
		await this.saveAuthData(data)
		return data
	},

	async getProfile(): Promise<User> {
		const token = await this.getToken()
		if (!token) {
			throw new Error('No token found')
		}

		const response = await fetch(`${API_BASE_URL}/auth/profile`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return handleResponse<User>(response)
	},

	async updateProfile(updates: Partial<{ name: string; avatar: string }>): Promise<User> {
		const token = await this.getToken()
		if (!token) {
			throw new Error('No token found')
		}

		const response = await fetch(`${API_BASE_URL}/auth/profile`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(updates),
		})
		return handleResponse<User>(response)
	},

	async saveAuthData(data: AuthResponse): Promise<void> {
		await AsyncStorage.multiSet([
			[TOKEN_KEY, data.accessToken],
			[USER_KEY, JSON.stringify(data.user)],
		])
	},

	async getToken(): Promise<string | null> {
		return AsyncStorage.getItem(TOKEN_KEY)
	},

	async getStoredUser(): Promise<User | null> {
		const userJson = await AsyncStorage.getItem(USER_KEY)
		return userJson ? JSON.parse(userJson) : null
	},

	async logout(): Promise<void> {
		await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY])
	},

	async isAuthenticated(): Promise<boolean> {
		const token = await this.getToken()
		return !!token
	},
}

