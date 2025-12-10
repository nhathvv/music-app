import { useTheme } from '@/store/theme'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const ProfileLayout = () => {
	const colors = useTheme()

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerTitle: 'Profile',
						headerTitleStyle: {
							color: colors.text,
						},
						headerStyle: {
							backgroundColor: colors.background,
						},
					}}
				/>
			</Stack>
		</View>
	)
}

export default ProfileLayout

