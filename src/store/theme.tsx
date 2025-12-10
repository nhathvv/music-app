import { ThemeColors, ThemeType, darkTheme, getThemeColors } from '@/constants/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance } from 'react-native'
import { create } from 'zustand'

const THEME_KEY = '@music_app_theme'

interface ThemeState {
	themeType: ThemeType
	isDark: boolean
	colors: ThemeColors
	setTheme: (theme: ThemeType) => Promise<void>
	loadStoredTheme: () => Promise<void>
	toggleTheme: () => Promise<void>
}

const getSystemTheme = (): 'dark' | 'light' => {
	return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'
}

const resolveTheme = (themeType: ThemeType): 'dark' | 'light' => {
	if (themeType === 'system') {
		return getSystemTheme()
	}
	return themeType
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
	themeType: 'dark',
	isDark: true,
	colors: darkTheme,

	setTheme: async (theme: ThemeType) => {
		const resolvedTheme = resolveTheme(theme)
		set({
			themeType: theme,
			isDark: resolvedTheme === 'dark',
			colors: getThemeColors(resolvedTheme),
		})
		await AsyncStorage.setItem(THEME_KEY, theme)
		console.log(`🎨 Theme changed to: ${theme}`)
	},

	loadStoredTheme: async () => {
		try {
			const storedTheme = (await AsyncStorage.getItem(THEME_KEY)) as ThemeType | null
			const theme = storedTheme || 'dark'
			const resolvedTheme = resolveTheme(theme)
			set({
				themeType: theme,
				isDark: resolvedTheme === 'dark',
				colors: getThemeColors(resolvedTheme),
			})
			console.log(`🎨 Loaded theme: ${theme}`)
		} catch (error) {
			console.error('Failed to load theme:', error)
		}
	},

	toggleTheme: async () => {
		const currentTheme = get().themeType
		let newTheme: ThemeType

		if (currentTheme === 'dark') {
			newTheme = 'light'
		} else if (currentTheme === 'light') {
			newTheme = 'system'
		} else {
			newTheme = 'dark'
		}

		await get().setTheme(newTheme)
	},
}))

export const useTheme = () => useThemeStore((state) => state.colors)
export const useIsDark = () => useThemeStore((state) => state.isDark)
export const useThemeType = () => useThemeStore((state) => state.themeType)

