import { fontSize } from '@/constants/tokens'
import { useAuthStore, useIsAuthenticated, useUser } from '@/store/auth'
import { useTheme, useThemeStore, useThemeType } from '@/store/theme'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

const ProfileScreen = () => {
	const colors = useTheme()
	const themeType = useThemeType()
	const setTheme = useThemeStore((state) => state.setTheme)

	const user = useUser()
	const isAuthenticated = useIsAuthenticated()
	const logout = useAuthStore((state) => state.logout)

	const handleLogout = () => {
		Alert.alert('Logout', 'Are you sure you want to logout?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Logout',
				style: 'destructive',
				onPress: async () => {
					await logout()
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					router.replace('/(auth)/login' as any)
				},
			},
		])
	}

	const handleLogin = () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		router.push('/(auth)/login' as any)
	}

	const handleThemeChange = () => {
		Alert.alert('Select Theme', 'Choose your preferred theme', [
			{
				text: 'Dark',
				onPress: () => setTheme('dark'),
			},
			{
				text: 'Light',
				onPress: () => setTheme('light'),
			},
			{
				text: 'System',
				onPress: () => setTheme('system'),
			},
			{ text: 'Cancel', style: 'cancel' },
		])
	}

	const getThemeLabel = () => {
		switch (themeType) {
			case 'dark':
				return 'Dark'
			case 'light':
				return 'Light'
			case 'system':
				return 'System'
			default:
				return 'Dark'
		}
	}

	const getThemeIcon = (): keyof typeof Ionicons.glyphMap => {
		switch (themeType) {
			case 'dark':
				return 'moon'
			case 'light':
				return 'sunny'
			case 'system':
				return 'phone-portrait-outline'
			default:
				return 'moon'
		}
	}

	const styles = createStyles(colors)

	return (
		<ScrollView
			style={[styles.container, { backgroundColor: colors.background }]}
			contentContainerStyle={styles.content}
		>
			<View style={styles.avatarSection}>
				<LinearGradient
					colors={['#fc3c44', '#ff6b6b', '#ee5a24']}
					style={styles.avatarContainer}
				>
					{user?.avatar ? (
						<Text style={styles.avatarText}>{user.name?.charAt(0).toUpperCase()}</Text>
					) : (
						<Ionicons name="person" size={48} color="#fff" />
					)}
				</LinearGradient>

				{isAuthenticated && user ? (
					<>
						<Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
						<Text style={[styles.userEmail, { color: colors.textMuted }]}>{user.email}</Text>
					</>
				) : (
					<>
						<Text style={[styles.userName, { color: colors.text }]}>Guest User</Text>
						<Text style={[styles.userEmail, { color: colors.textMuted }]}>Not logged in</Text>
					</>
				)}
			</View>

			<View style={styles.section}>
				<Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Account</Text>

				{isAuthenticated ? (
					<>
						<MenuItem
							icon="person-outline"
							title="Edit Profile"
							colors={colors}
							onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
						/>
						<MenuItem
							icon="notifications-outline"
							title="Notifications"
							colors={colors}
							onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
						/>
						<MenuItem
							icon="shield-checkmark-outline"
							title="Privacy"
							colors={colors}
							onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
						/>
					</>
				) : (
					<MenuItem
						icon="log-in-outline"
						title="Login / Register"
						colors={colors}
						onPress={handleLogin}
					/>
				)}
			</View>

			<View style={styles.section}>
				<Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Preferences</Text>

				<MenuItem
					icon={getThemeIcon()}
					title="Theme"
					subtitle={getThemeLabel()}
					colors={colors}
					onPress={handleThemeChange}
				/>
				<MenuItem
					icon="language-outline"
					title="Language"
					subtitle="English"
					colors={colors}
					onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
				/>
				<MenuItem
					icon="musical-notes-outline"
					title="Audio Quality"
					subtitle="High"
					colors={colors}
					onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
				/>
			</View>

			<View style={styles.section}>
				<Text style={[styles.sectionTitle, { color: colors.textMuted }]}>About</Text>

				<MenuItem
					icon="information-circle-outline"
					title="App Version"
					subtitle="1.0.0"
					showArrow={false}
					colors={colors}
				/>
				<MenuItem
					icon="document-text-outline"
					title="Terms of Service"
					colors={colors}
					onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
				/>
				<MenuItem
					icon="help-circle-outline"
					title="Help & Support"
					colors={colors}
					onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
				/>
			</View>

			{isAuthenticated && (
				<Pressable style={styles.logoutButton} onPress={handleLogout}>
					<Ionicons name="log-out-outline" size={20} color={colors.error} />
					<Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
				</Pressable>
			)}

			<View style={styles.footer}>
				<Text style={[styles.footerText, { color: colors.textMuted }]}>
					Made with ❤️ by Hoang Van Nhat
				</Text>
			</View>
		</ScrollView>
	)
}

interface MenuItemProps {
	icon: keyof typeof Ionicons.glyphMap
	title: string
	subtitle?: string
	showArrow?: boolean
	colors: ReturnType<typeof useTheme>
	onPress?: () => void
}

const MenuItem = ({ icon, title, subtitle, showArrow = true, colors, onPress }: MenuItemProps) => (
	<Pressable
		style={[styles.menuItem, { backgroundColor: colors.card }]}
		onPress={onPress}
	>
		<View style={styles.menuItemLeft}>
			<View style={[styles.menuIconContainer, { backgroundColor: `${colors.primary}20` }]}>
				<Ionicons name={icon} size={22} color={colors.primary} />
			</View>
			<View>
				<Text style={[styles.menuItemTitle, { color: colors.text }]}>{title}</Text>
				{subtitle && (
					<Text style={[styles.menuItemSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
				)}
			</View>
		</View>
		{showArrow && <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}
	</Pressable>
)

const createStyles = (colors: ReturnType<typeof useTheme>) =>
	StyleSheet.create({
		container: {
			flex: 1,
		},
		content: {
			paddingBottom: 120,
		},
		avatarSection: {
			alignItems: 'center',
			paddingVertical: 32,
		},
		avatarContainer: {
			width: 100,
			height: 100,
			borderRadius: 50,
			justifyContent: 'center',
			alignItems: 'center',
			marginBottom: 16,
		},
		avatarText: {
			fontSize: 40,
			fontWeight: 'bold',
			color: '#fff',
		},
		userName: {
			fontSize: fontSize.lg,
			fontWeight: 'bold',
			marginBottom: 4,
		},
		userEmail: {
			fontSize: fontSize.sm,
		},
		section: {
			paddingHorizontal: 16,
			marginBottom: 24,
		},
		sectionTitle: {
			fontSize: fontSize.xs,
			fontWeight: '600',
			textTransform: 'uppercase',
			letterSpacing: 1,
			marginBottom: 12,
			paddingLeft: 4,
		},
		logoutButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 8,
			marginHorizontal: 16,
			marginTop: 8,
			padding: 16,
			borderRadius: 12,
			backgroundColor: `${colors.error}15`,
			borderWidth: 1,
			borderColor: `${colors.error}30`,
		},
		logoutText: {
			fontSize: fontSize.sm,
			fontWeight: '600',
		},
		footer: {
			alignItems: 'center',
			paddingVertical: 32,
		},
		footerText: {
			fontSize: fontSize.xs,
		},
	})

const styles = StyleSheet.create({
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 14,
		borderRadius: 12,
		marginBottom: 8,
	},
	menuItemLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	menuIconContainer: {
		width: 36,
		height: 36,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	menuItemTitle: {
		fontSize: fontSize.sm,
		fontWeight: '500',
	},
	menuItemSubtitle: {
		fontSize: fontSize.xs,
		marginTop: 2,
	},
})

export default ProfileScreen
