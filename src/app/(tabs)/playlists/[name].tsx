import { PlaylistTracksList } from '@/components/PlaylistTracksList'
import { fontSize, screenPadding } from '@/constants/tokens'
import { usePlaylists } from '@/store/library'
import { useTheme } from '@/store/theme'
import { Ionicons } from '@expo/vector-icons'
import { Redirect, router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

const PlaylistScreen = () => {
	const colors = useTheme()
	const navigation = useNavigation()
	const { name: playlistId } = useLocalSearchParams<{ name: string }>()

	const { playlists, deletePlaylist } = usePlaylists()

	const playlist = playlists.find((p) => p._id === playlistId)

	const handleDeletePlaylist = () => {
		if (!playlist?._id) return

		Alert.alert(
			'Delete Playlist',
			`Are you sure you want to delete "${playlist.name}"? This action cannot be undone.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						await deletePlaylist(playlist._id!)
						router.back()
					},
				},
			],
		)
	}

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Pressable onPress={handleDeletePlaylist} style={styles.headerButton}>
					<Ionicons name="trash-outline" size={22} color={colors.error} />
				</Pressable>
			),
		})
	}, [navigation, playlist, colors])

	if (!playlist) {
		console.warn(`Playlist ${playlistId} was not found!`)
		return <Redirect href={'/(tabs)/playlists'} />
	}

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: screenPadding.horizontal }}
			>
				<View style={styles.header}>
					<View style={[styles.playlistIcon, { backgroundColor: `${colors.primary}20` }]}>
						<Ionicons name="musical-notes" size={40} color={colors.primary} />
					</View>
					<Text style={[styles.playlistName, { color: colors.text }]}>{playlist.name}</Text>
					<Text style={[styles.trackCount, { color: colors.textMuted }]}>
						{playlist.tracks.length} {playlist.tracks.length === 1 ? 'track' : 'tracks'}
					</Text>
				</View>

				{playlist.tracks.length > 0 ? (
					<PlaylistTracksList playlist={playlist} />
				) : (
					<View style={styles.emptyContainer}>
						<Ionicons name="musical-notes-outline" size={64} color={colors.textMuted} />
						<Text style={[styles.emptyText, { color: colors.textMuted }]}>
							This playlist is empty
						</Text>
						<Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
							Add tracks by long-pressing on any song
						</Text>
					</View>
				)}
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerButton: {
		padding: 8,
	},
	header: {
		alignItems: 'center',
		paddingVertical: 24,
	},
	playlistIcon: {
		width: 100,
		height: 100,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
	},
	playlistName: {
		fontSize: fontSize.lg,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	trackCount: {
		fontSize: fontSize.sm,
	},
	emptyContainer: {
		alignItems: 'center',
		paddingVertical: 60,
	},
	emptyText: {
		fontSize: fontSize.base,
		fontWeight: '600',
		marginTop: 16,
	},
	emptySubtext: {
		fontSize: fontSize.sm,
		marginTop: 8,
		textAlign: 'center',
	},
})

export default PlaylistScreen
