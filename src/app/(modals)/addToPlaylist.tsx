import { PlaylistsList } from '@/components/PlaylistsList'
import { fontSize, screenPadding } from '@/constants/tokens'
import { Playlist } from '@/helpers/types'
import { usePlaylists, useTracks } from '@/store/library'
import { useQueue } from '@/store/queue'
import { useTheme } from '@/store/theme'
import { Ionicons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TrackPlayer, { Track } from 'react-native-track-player'

const AddToPlaylistModal = () => {
	const colors = useTheme()
	const router = useRouter()
	const headerHeight = useHeaderHeight()

	const { activeQueueId } = useQueue()

	const { trackUrl } = useLocalSearchParams<{ trackUrl: Track['url'] }>()

	const tracks = useTracks()
	const { playlists, addToPlaylist, createPlaylist } = usePlaylists()

	const [showCreateNew, setShowCreateNew] = useState(false)
	const [newPlaylistName, setNewPlaylistName] = useState('')
	const [isCreating, setIsCreating] = useState(false)

	const track = tracks.find((currentTrack) => trackUrl === currentTrack.url)

	if (!track) {
		return null
	}

	const availablePlaylists = playlists.filter(
		(playlist) => !playlist.tracks.some((playlistTrack) => playlistTrack.url === track.url),
	)

	const handlePlaylistPress = async (playlist: Playlist) => {
		if (!playlist._id) return

		addToPlaylist(track, playlist._id)
		router.dismiss()

		if (activeQueueId?.startsWith(playlist.name)) {
			await TrackPlayer.add(track)
		}
	}

	const handleCreatePlaylist = async () => {
		const trimmedName = newPlaylistName.trim()

		if (!trimmedName) {
			Alert.alert('Error', 'Please enter a playlist name')
			return
		}

		if (playlists.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())) {
			Alert.alert('Error', 'A playlist with this name already exists')
			return
		}

		setIsCreating(true)
		try {
			const newPlaylist = await createPlaylist(trimmedName)
			if (newPlaylist) {
				addToPlaylist(track, newPlaylist._id)
			}
			router.dismiss()
		} catch {
			Alert.alert('Error', 'Failed to create playlist')
		} finally {
			setIsCreating(false)
		}
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView
				style={[
					styles.modalContainer,
					{ paddingTop: headerHeight, backgroundColor: colors.background },
				]}
			>
				<Pressable
					style={[styles.createNewButton, { backgroundColor: colors.card, borderColor: colors.border }]}
					onPress={() => setShowCreateNew(!showCreateNew)}
				>
					<View style={[styles.createNewIconContainer, { backgroundColor: `${colors.primary}20` }]}>
						<Ionicons name="add" size={24} color={colors.primary} />
					</View>
					<Text style={[styles.createNewText, { color: colors.text }]}>Create New Playlist</Text>
					<Ionicons
						name={showCreateNew ? 'chevron-up' : 'chevron-down'}
						size={20}
						color={colors.textMuted}
					/>
				</Pressable>

				{showCreateNew && (
					<View style={[styles.createNewForm, { backgroundColor: colors.card }]}>
						<TextInput
							style={[
								styles.input,
								{
									backgroundColor: colors.surface,
									color: colors.text,
									borderColor: colors.border,
								},
							]}
							placeholder="Enter playlist name"
							placeholderTextColor={colors.textMuted}
							value={newPlaylistName}
							onChangeText={setNewPlaylistName}
							autoFocus
							onSubmitEditing={handleCreatePlaylist}
							editable={!isCreating}
						/>
						<View style={styles.formButtons}>
							<Pressable
								style={[styles.cancelButton, { borderColor: colors.border }]}
								onPress={() => {
									setShowCreateNew(false)
									setNewPlaylistName('')
								}}
								disabled={isCreating}
							>
								<Text style={[styles.cancelButtonText, { color: colors.textMuted }]}>Cancel</Text>
							</Pressable>
							<Pressable
								style={[
									styles.createButton,
									{ backgroundColor: isCreating ? colors.textMuted : colors.primary },
								]}
								onPress={handleCreatePlaylist}
								disabled={isCreating}
							>
								<Text style={styles.createButtonText}>
									{isCreating ? 'Creating...' : 'Create & Add'}
								</Text>
							</Pressable>
						</View>
					</View>
				)}

				{availablePlaylists.length > 0 ? (
					<>
						<Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
							Add to existing playlist
						</Text>
						<PlaylistsList playlists={availablePlaylists} onPlaylistPress={handlePlaylistPress} />
					</>
				) : (
					<View style={styles.emptyContainer}>
						<Ionicons name="musical-notes-outline" size={48} color={colors.textMuted} />
						<Text style={[styles.emptyText, { color: colors.textMuted }]}>
							{playlists.length === 0
								? 'No playlists yet. Create your first one!'
								: 'This track is already in all your playlists'}
						</Text>
					</View>
				)}
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		paddingHorizontal: screenPadding.horizontal,
	},
	createNewButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderStyle: 'dashed',
	},
	createNewIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	createNewText: {
		flex: 1,
		fontSize: fontSize.sm,
		fontWeight: '600',
	},
	createNewForm: {
		padding: 16,
		borderRadius: 12,
		marginBottom: 16,
	},
	input: {
		padding: 14,
		borderRadius: 8,
		fontSize: fontSize.sm,
		borderWidth: 1,
		marginBottom: 12,
	},
	formButtons: {
		flexDirection: 'row',
		gap: 12,
	},
	cancelButton: {
		flex: 1,
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
		borderWidth: 1,
	},
	cancelButtonText: {
		fontSize: fontSize.sm,
		fontWeight: '500',
	},
	createButton: {
		flex: 1,
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
	createButtonText: {
		color: '#fff',
		fontSize: fontSize.sm,
		fontWeight: '600',
	},
	sectionTitle: {
		fontSize: fontSize.xs,
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: 1,
		marginBottom: 12,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 16,
	},
	emptyText: {
		fontSize: fontSize.sm,
		textAlign: 'center',
		maxWidth: 250,
	},
})

export default AddToPlaylistModal
