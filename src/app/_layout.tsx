import { playbackService } from '@/constants/playbackService'
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState'
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer'
import { useFetchTracks } from '@/store/library'
import { useIsDark, useTheme, useThemeStore } from '@/store/theme'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import TrackPlayer from 'react-native-track-player'

SplashScreen.preventAutoHideAsync()

TrackPlayer.registerPlaybackService(() => playbackService)

const App = () => {
	const fetchTracks = useFetchTracks()
	const loadStoredTheme = useThemeStore((state) => state.loadStoredTheme)

	const handleTrackPlayerLoaded = useCallback(() => {
		SplashScreen.hideAsync()
	}, [])

	useSetupTrackPlayer({
		onLoad: handleTrackPlayerLoaded,
	})

	useLogTrackPlayerState()

	useEffect(() => {
		fetchTracks()
		loadStoredTheme()
	}, [fetchTracks, loadStoredTheme])

	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<RootNavigation />
			</GestureHandlerRootView>
		</SafeAreaProvider>
	)
}

const RootNavigation = () => {
	const colors = useTheme()
	const isDark = useIsDark()

	return (
		<>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />

				<Stack.Screen name="(auth)" options={{ headerShown: false }} />

				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />

				<Stack.Screen
					name="player"
					options={{
						presentation: 'card',
						gestureEnabled: true,
						gestureDirection: 'vertical',
						animationDuration: 400,
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="(modals)/addToPlaylist"
					options={{
						presentation: 'modal',
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTitle: 'Add to playlist',
						headerTitleStyle: {
							color: colors.text,
						},
					}}
				/>

				<Stack.Screen
					name="(modals)/createTrack"
					options={{
						presentation: 'modal',
						headerStyle: {
							backgroundColor: colors.background,
						},
						headerTitle: 'Create New Track',
						headerTitleStyle: {
							color: colors.text,
						},
					}}
				/>
			</Stack>
			<StatusBar style={isDark ? 'light' : 'dark'} />
		</>
	)
}

export default App
