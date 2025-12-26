import { PlayPauseButton, SkipToNextButton } from '@/components/PlayerControls'
import { unknownTrackImageUri } from '@/constants/images'
import { useLastActiveTrack } from '@/hooks/useLastActiveTrack'
import { useIsDark, useTheme } from '@/store/theme'
import { useRouter } from 'expo-router'
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useActiveTrack } from 'react-native-track-player'
import { MovingText } from './MovingText'

export const FloatingPlayer = ({ style }: ViewProps) => {
	const router = useRouter()
	const colors = useTheme()
	const isDark = useIsDark()

	const activeTrack = useActiveTrack()
	const lastActiveTrack = useLastActiveTrack()

	const displayedTrack = activeTrack ?? lastActiveTrack

	const handlePress = () => {
		router.navigate('/player')
	}

	if (!displayedTrack) return null

	const containerBg = isDark ? '#252525' : '#f0f0f0'

	return (
		<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.9}
			style={[styles.container, { backgroundColor: containerBg }, style]}
		>
			<>
				<FastImage
					source={{
						uri: displayedTrack.artwork ?? unknownTrackImageUri,
					}}
					style={styles.trackArtworkImage}
				/>

				<View style={styles.trackTitleContainer}>
					<MovingText
						style={[styles.trackTitle, { color: colors.text }]}
						text={displayedTrack.title ?? ''}
						animationThreshold={25}
					/>
				</View>

				<View style={styles.trackControlsContainer}>
					<PlayPauseButton iconSize={24} />
					<SkipToNextButton iconSize={22} />
				</View>
			</>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 8,
		borderRadius: 12,
		paddingVertical: 10,
	},
	trackArtworkImage: {
		width: 40,
		height: 40,
		borderRadius: 8,
	},
	trackTitleContainer: {
		flex: 1,
		overflow: 'hidden',
		marginLeft: 10,
	},
	trackTitle: {
		fontSize: 18,
		fontWeight: '600',
		paddingLeft: 10,
	},
	trackControlsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 20,
		marginRight: 16,
		paddingLeft: 16,
	},
})
