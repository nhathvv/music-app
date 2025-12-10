import { colors } from '@/constants/tokens'
import { defaultStyles } from '@/styles'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const ProfileLayout = () => {
	return (
		<View style={defaultStyles.container}>
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

