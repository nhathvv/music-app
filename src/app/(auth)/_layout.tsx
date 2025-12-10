import { colors } from '@/constants/tokens'
import { Stack } from 'expo-router'

const AuthLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.background,
				},
				headerTintColor: colors.text,
				headerTitleStyle: {
					fontWeight: 'bold',
				},
				contentStyle: {
					backgroundColor: colors.background,
				},
			}}
		>
			<Stack.Screen
				name="login"
				options={{
					title: 'Login',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="register"
				options={{
					title: 'Register',
					headerShown: false,
				}}
			/>
		</Stack>
	)
}

export default AuthLayout

