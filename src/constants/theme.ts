export type ThemeType = 'dark' | 'light' | 'system'

export interface ThemeColors {
	primary: string
	background: string
	surface: string
	text: string
	textMuted: string
	icon: string
	border: string
	card: string
	maximumTrackTintColor: string
	minimumTrackTintColor: string
	tabBar: string
	success: string
	error: string
	warning: string
}

export const darkTheme: ThemeColors = {
	primary: '#fc3c44',
	background: '#000000',
	surface: '#1a1a1a',
	text: '#ffffff',
	textMuted: '#9ca3af',
	icon: '#ffffff',
	border: 'rgba(255, 255, 255, 0.1)',
	card: 'rgba(255, 255, 255, 0.05)',
	maximumTrackTintColor: 'rgba(255, 255, 255, 0.4)',
	minimumTrackTintColor: 'rgba(255, 255, 255, 0.6)',
	tabBar: 'rgba(0, 0, 0, 0.9)',
	success: '#22c55e',
	error: '#ef4444',
	warning: '#f59e0b',
}

export const lightTheme: ThemeColors = {
	primary: '#fc3c44',
	background: '#f5f5f7',
	surface: '#ffffff',
	text: '#1a1a1a',
	textMuted: '#6b7280',
	icon: '#1a1a1a',
	border: 'rgba(0, 0, 0, 0.1)',
	card: 'rgba(0, 0, 0, 0.03)',
	maximumTrackTintColor: 'rgba(0, 0, 0, 0.2)',
	minimumTrackTintColor: 'rgba(0, 0, 0, 0.4)',
	tabBar: 'rgba(255, 255, 255, 0.9)',
	success: '#16a34a',
	error: '#dc2626',
	warning: '#d97706',
}

export const getThemeColors = (theme: 'dark' | 'light'): ThemeColors => {
	return theme === 'dark' ? darkTheme : lightTheme
}

