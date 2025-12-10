import { colors, fontSize } from '@/constants/tokens'
import { useAuthStore, useUser, useIsAuthenticated } from '@/store/auth'
import { defaultStyles } from '@/styles'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

const ProfileScreen = () => {
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

	return (
		<ScrollView style={defaultStyles.container} contentContainerStyle={styles.content}>
			<View style={styles.avatarSection}>
				<LinearGradient
					colors={['#fc3c44', '#ff6b6b', '#ee5a24']}
					style={styles.avatarContainer}
				>
					{user?.avatar ? (
						<Text style={styles.avatarText}>{user.name?.charAt(0).toUpperCase()}</Text>
					) : (
						<Ionicons name="person" size={48} color={colors.text} />
					)}
				</LinearGradient>

				{isAuthenticated && user ? (
					<>
						<Text style={styles.userName}>{user.name}</Text>
						<Text style={styles.userEmail}>{user.email}</Text>
					</>
				) : (
					<>
						<Text style={styles.userName}>Guest User</Text>
						<Text style={styles.userEmail}>Not logged in</Text>
					</>
				)}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Account</Text>

				{isAuthenticated ? (
					<>
						<MenuItem
							icon="person-outline"
							title="Edit Profile"
							onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
						/>
						<MenuItem
							icon="notifications-outline"
							title="Notifications"
							onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
						/>
						<MenuItem
							icon="shield-checkmark-outline"
							title="Privacy"
							onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
						/>
					</>
				) : (
					<MenuItem icon="log-in-outline" title="Login / Register" onPress={handleLogin} />
				)}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Preferences</Text>

				<MenuItem
					icon="color-palette-outline"
					title="Theme"
					subtitle="Dark"
					onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
				/>
				<MenuItem
					icon="language-outline"
					title="Language"
					subtitle="English"
					onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
				/>
				<MenuItem
					icon="musical-notes-outline"
					title="Audio Quality"
					subtitle="High"
					onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
				/>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>About</Text>

				<MenuItem
					icon="information-circle-outline"
					title="App Version"
					subtitle="1.0.0"
					showArrow={false}
				/>
				<MenuItem
					icon="document-text-outline"
					title="Terms of Service"
					onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
				/>
				<MenuItem
					icon="help-circle-outline"
					title="Help & Support"
					onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
				/>
			</View>

			{isAuthenticated && (
				<Pressable style={styles.logoutButton} onPress={handleLogout}>
					<Ionicons name="log-out-outline" size={20} color="#ef4444" />
					<Text style={styles.logoutText}>Logout</Text>
				</Pressable>
			)}

			<View style={styles.footer}>
				<Text style={styles.footerText}>Made with ❤️ by Hoang Van Nhat</Text>
			</View>
		</ScrollView>
	)
}

interface MenuItemProps {
	icon: keyof typeof Ionicons.glyphMap
	title: string
	subtitle?: string
	showArrow?: boolean
	onPress?: () => void
}

const MenuItem = ({ icon, title, subtitle, showArrow = true, onPress }: MenuItemProps) => (
	<Pressable style={styles.menuItem} onPress={onPress}>
		<View style={styles.menuItemLeft}>
			<View style={styles.menuIconContainer}>
				<Ionicons name={icon} size={22} color={colors.primary} />
			</View>
			<View>
				<Text style={styles.menuItemTitle}>{title}</Text>
				{subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
			</View>
		</View>
		{showArrow && <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}
	</Pressable>
)

const styles = StyleSheet.create({
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
		color: colors.text,
	},
	userName: {
		fontSize: fontSize.lg,
		fontWeight: 'bold',
		color: colors.text,
		marginBottom: 4,
	},
	userEmail: {
		fontSize: fontSize.sm,
		color: colors.textMuted,
	},
	section: {
		paddingHorizontal: 16,
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: fontSize.xs,
		fontWeight: '600',
		color: colors.textMuted,
		textTransform: 'uppercase',
		letterSpacing: 1,
		marginBottom: 12,
		paddingLeft: 4,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
		backgroundColor: 'rgba(252, 60, 68, 0.15)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	menuItemTitle: {
		fontSize: fontSize.sm,
		color: colors.text,
		fontWeight: '500',
	},
	menuItemSubtitle: {
		fontSize: fontSize.xs,
		color: colors.textMuted,
		marginTop: 2,
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
		backgroundColor: 'rgba(239, 68, 68, 0.1)',
		borderWidth: 1,
		borderColor: 'rgba(239, 68, 68, 0.3)',
	},
	logoutText: {
		fontSize: fontSize.sm,
		fontWeight: '600',
		color: '#ef4444',
	},
	footer: {
		alignItems: 'center',
		paddingVertical: 32,
	},
	footerText: {
		fontSize: fontSize.xs,
		color: colors.textMuted,
	},
})

export default ProfileScreen

