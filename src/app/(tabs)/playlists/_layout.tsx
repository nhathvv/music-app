import { useTheme } from '@/store/theme'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const PlaylistsScreenLayout = () => {
	const colors = useTheme()

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerLargeTitle: true,
						headerLargeStyle: { backgroundColor: colors.background },
						headerLargeTitleStyle: { color: colors.text },
						headerTintColor: colors.text,
						headerTransparent: true,
						headerBlurEffect: 'prominent',
						headerShadowVisible: false,
						headerTitle: 'Playlists',
					}}
				/>

				<Stack.Screen
					name="[name]"
					options={{
						headerTitle: '',
						headerBackVisible: true,
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTintColor: colors.primary,
					}}
				/>
			</Stack>
		</View>
	)
}

export default PlaylistsScreenLayout
