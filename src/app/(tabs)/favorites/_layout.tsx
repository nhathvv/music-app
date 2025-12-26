import { useTheme } from '@/store/theme'
import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const FavoritesScreenLayout = () => {
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
						headerTitle: 'Favorites',
					}}
				/>
			</Stack>
		</View>
	)
}

export default FavoritesScreenLayout
