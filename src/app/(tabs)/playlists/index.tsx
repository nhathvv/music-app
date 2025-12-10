import { PlaylistsList } from '@/components/PlaylistsList'
import { fontSize, screenPadding } from '@/constants/tokens'
import { playlistNameFilter } from '@/helpers/filter'
import { Playlist } from '@/helpers/types'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { usePlaylists } from '@/store/library'
import { useTheme } from '@/store/theme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import {
	Alert,
	Keyboard,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native'

const PlaylistsScreen = () => {
	const colors = useTheme()
	const router = useRouter()

	const [showCreateNew, setShowCreateNew] = useState(false)
	const [newPlaylistName, setNewPlaylistName] = useState('')
	const [isCreating, setIsCreating] = useState(false)

	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in playlists',
		},
	})

	const { playlists, createPlaylist } = usePlaylists()

	const filteredPlaylists = useMemo(() => {
		return playlists.filter(playlistNameFilter(search))
	}, [playlists, search])

	const handlePlaylistPress = (playlist: Playlist) => {
		if (playlist._id) {
			router.push(`/(tabs)/playlists/${playlist._id}`)
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
			await createPlaylist(trimmedName)
			setNewPlaylistName('')
			setShowCreateNew(false)
		} catch {
			Alert.alert('Error', 'Failed to create playlist')
		} finally {
			setIsCreating(false)
		}
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<ScrollView
					contentInsetAdjustmentBehavior="automatic"
					style={{ paddingHorizontal: screenPadding.horizontal }}
				>
					<Pressable
						style={[
							styles.createNewButton,
							{ backgroundColor: colors.card, borderColor: colors.border },
						]}
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
										{isCreating ? 'Creating...' : 'Create'}
									</Text>
								</Pressable>
							</View>
						</View>
					)}

					{filteredPlaylists.length > 0 ? (
						<PlaylistsList
							scrollEnabled={false}
							playlists={filteredPlaylists}
							onPlaylistPress={handlePlaylistPress}
						/>
					) : (
						<View style={styles.emptyContainer}>
							<Ionicons name="musical-notes-outline" size={64} color={colors.textMuted} />
							<Text style={[styles.emptyText, { color: colors.textMuted }]}>
								{search ? 'No playlists found' : 'No playlists yet'}
							</Text>
							<Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
								{search ? 'Try a different search' : 'Create your first playlist above!'}
							</Text>
						</View>
					)}
				</ScrollView>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	createNewButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 12,
		marginTop: 16,
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

export default PlaylistsScreen
