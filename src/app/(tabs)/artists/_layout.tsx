import { useTheme } from '@/store/theme'
import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const ArtistsScreenLayout = () => {
	const colors = useTheme()

	return (
		<View style={[defaultStyles.container, { backgroundColor: colors.background }]}>
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
						headerTitle: 'Artists',
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

export default ArtistsScreenLayout
