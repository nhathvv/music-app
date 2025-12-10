import { colors } from '@/constants/tokens'
import { useAuthStore } from '@/store/auth'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

const Index = () => {
	const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore()
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		const checkAuth = async () => {
			await loadStoredAuth()
			setIsReady(true)
		}
		checkAuth()
	}, [loadStoredAuth])

	useEffect(() => {
		if (isReady && !isLoading) {
			if (isAuthenticated) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				router.replace('/(tabs)' as any)
			} else {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				router.replace('/(auth)/login' as any)
			}
		}
	}, [isReady, isLoading, isAuthenticated])

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
			<ActivityIndicator size="large" color={colors.primary} />
		</View>
	)
}

export default Index

