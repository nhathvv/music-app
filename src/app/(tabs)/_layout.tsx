import { FloatingPlayer } from '@/components/FloatingPlayer'
import { fontSize } from '@/constants/tokens'
import { useIsDark, useTheme } from '@/store/theme'
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { StyleSheet } from 'react-native'

const TabsNavigation = () => {
	const colors = useTheme()
	const isDark = useIsDark()

	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: colors.primary,
					tabBarInactiveTintColor: colors.textMuted,
					tabBarLabelStyle: {
						fontSize: fontSize.xs,
						fontWeight: '500',
					},
					headerShown: false,
					tabBarStyle: {
						position: 'absolute',
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						borderTopWidth: 0,
						paddingTop: 8,
						backgroundColor: isDark ? 'transparent' : colors.surface,
					},
					tabBarBackground: () => (
						<BlurView
							intensity={95}
							tint={isDark ? 'dark' : 'light'}
							style={{
								...StyleSheet.absoluteFillObject,
								overflow: 'hidden',
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
							}}
						/>
					),
				}}
			>
				<Tabs.Screen
					name="favorites"
					options={{
						title: 'Favorites',
						tabBarIcon: ({ color }) => <FontAwesome name="heart" size={20} color={color} />,
					}}
				/>
				<Tabs.Screen
					name="playlists"
					options={{
						title: 'Playlists',
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons name="playlist-play" size={28} color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="(songs)"
					options={{
						title: 'Songs',
						tabBarIcon: ({ color }) => (
							<Ionicons name="musical-notes-sharp" size={24} color={color} />
						),
					}}
				/>
			<Tabs.Screen
				name="artists"
				options={{
					title: 'Artists',
					tabBarIcon: ({ color }) => <FontAwesome6 name="users-line" size={20} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={24} color={color} />,
				}}
			/>
		</Tabs>

			<FloatingPlayer
				style={{
					position: 'absolute',
					left: 8,
					right: 8,
					bottom: 78,
				}}
			/>
		</>
	)
}

export default TabsNavigation
