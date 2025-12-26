import { useIsDark, useTheme } from '@/store/theme'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import TrackPlayer, { Track } from 'react-native-track-player'

type QueueControlsProps = {
	tracks: Track[]
} & ViewProps

export const QueueControls = ({ tracks, style, ...viewProps }: QueueControlsProps) => {
	const colors = useTheme()
	const isDark = useIsDark()

	const handlePlay = async () => {
		await TrackPlayer.setQueue(tracks)
		await TrackPlayer.play()
	}

	const handleShufflePlay = async () => {
		const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5)

		await TrackPlayer.setQueue(shuffledTracks)
		await TrackPlayer.play()
	}

	const buttonBg = isDark ? 'rgba(47, 47, 47, 0.5)' : 'rgba(200, 200, 200, 0.5)'

	return (
		<View style={[{ flexDirection: 'row', columnGap: 16 }, style]} {...viewProps}>
			<View style={{ flex: 1 }}>
				<TouchableOpacity
					onPress={handlePlay}
					activeOpacity={0.8}
					style={[styles.button, { backgroundColor: buttonBg }]}
				>
					<Ionicons name="play" size={22} color={colors.primary} />
					<Text style={[styles.buttonText, { color: colors.primary }]}>Play</Text>
				</TouchableOpacity>
			</View>

			<View style={{ flex: 1 }}>
				<TouchableOpacity
					onPress={handleShufflePlay}
					activeOpacity={0.8}
					style={[styles.button, { backgroundColor: buttonBg }]}
				>
					<Ionicons name={'shuffle-sharp'} size={24} color={colors.primary} />
					<Text style={[styles.buttonText, { color: colors.primary }]}>Shuffle</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	button: {
		padding: 12,
		borderRadius: 8,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		columnGap: 8,
	},
	buttonText: {
		fontWeight: '600',
		fontSize: 18,
		textAlign: 'center',
	},
})
