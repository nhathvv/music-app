import { fontSize, screenPadding } from '@/constants/tokens'
import { useIsOffline, useTrackActions } from '@/store/library'
import { useTheme } from '@/store/theme'
import { Ionicons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { useRouter } from 'expo-router'
import { useState } from 'react'
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
import { SafeAreaView } from 'react-native-safe-area-context'

const CreateTrackModal = () => {
	const colors = useTheme()
	const router = useRouter()
	const headerHeight = useHeaderHeight()
	const isOffline = useIsOffline()
	const { createTrack } = useTrackActions()

	const [url, setUrl] = useState('')
	const [title, setTitle] = useState('')
	const [artist, setArtist] = useState('')
	const [artwork, setArtwork] = useState('')
	const [duration, setDuration] = useState('')
	const [genre, setGenre] = useState('')
	const [isCreating, setIsCreating] = useState(false)

	const handleCreate = async () => {
		const trimmedUrl = url.trim()
		const trimmedTitle = title.trim()

		if (!trimmedUrl) {
			Alert.alert('Error', 'Please enter a track URL')
			return
		}

		if (!trimmedTitle) {
			Alert.alert('Error', 'Please enter a track title')
			return
		}

		if (isOffline) {
			Alert.alert('Offline', 'Cannot create track while offline')
			return
		}

		setIsCreating(true)
		try {
			await createTrack({
				url: trimmedUrl,
				title: trimmedTitle,
				artist: artist.trim() || undefined,
				artwork: artwork.trim() || undefined,
				duration: duration ? parseInt(duration, 10) : undefined,
				genre: genre.trim() || undefined,
			})
			Alert.alert('Success', 'Track created successfully', [
				{ text: 'OK', onPress: () => router.dismiss() },
			])
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to create track'
			Alert.alert('Error', message)
		} finally {
			setIsCreating(false)
		}
	}

	const renderInput = (
		label: string,
		value: string,
		onChangeText: (text: string) => void,
		placeholder: string,
		options?: {
			required?: boolean
			keyboardType?: 'default' | 'numeric' | 'url'
			autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
		}
	) => (
		<View style={styles.inputGroup}>
			<Text style={[styles.label, { color: colors.text }]}>
				{label}
				{options?.required && <Text style={{ color: colors.primary }}> *</Text>}
			</Text>
			<TextInput
				style={[
					styles.input,
					{
						backgroundColor: colors.surface,
						color: colors.text,
						borderColor: colors.border,
					},
				]}
				placeholder={placeholder}
				placeholderTextColor={colors.textMuted}
				value={value}
				onChangeText={onChangeText}
				editable={!isCreating}
				keyboardType={options?.keyboardType || 'default'}
				autoCapitalize={options?.autoCapitalize || 'sentences'}
			/>
		</View>
	)

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView
				style={[
					styles.modalContainer,
					{ paddingTop: headerHeight, backgroundColor: colors.background },
				]}
			>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
				>
					<View style={[styles.infoCard, { backgroundColor: colors.card }]}>
						<Ionicons name="information-circle" size={20} color={colors.primary} />
						<Text style={[styles.infoText, { color: colors.textMuted }]}>
							Add a new track by providing the audio URL and details below.
						</Text>
					</View>

					{renderInput('Audio URL', url, setUrl, 'https://example.com/audio.mp3', {
						required: true,
						keyboardType: 'url',
						autoCapitalize: 'none',
					})}

					{renderInput('Title', title, setTitle, 'Track title', {
						required: true,
					})}

					{renderInput('Artist', artist, setArtist, 'Artist name')}

					{renderInput('Artwork URL', artwork, setArtwork, 'https://example.com/cover.jpg', {
						keyboardType: 'url',
						autoCapitalize: 'none',
					})}

					{renderInput('Duration (seconds)', duration, setDuration, '180', {
						keyboardType: 'numeric',
					})}

					{renderInput('Genre', genre, setGenre, 'Pop, Rock, Jazz...')}

					<View style={styles.buttonContainer}>
						<Pressable
							style={[styles.cancelButton, { borderColor: colors.border }]}
							onPress={() => router.dismiss()}
							disabled={isCreating}
						>
							<Text style={[styles.cancelButtonText, { color: colors.textMuted }]}>
								Cancel
							</Text>
						</Pressable>
						<Pressable
							style={[
								styles.createButton,
								{ backgroundColor: isCreating ? colors.textMuted : colors.primary },
							]}
							onPress={handleCreate}
							disabled={isCreating}
						>
							<Ionicons
								name={isCreating ? 'hourglass' : 'add-circle'}
								size={20}
								color="#fff"
								style={styles.buttonIcon}
							/>
							<Text style={styles.createButtonText}>
								{isCreating ? 'Creating...' : 'Create Track'}
							</Text>
						</Pressable>
					</View>
				</ScrollView>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: screenPadding.horizontal,
		paddingBottom: 40,
	},
	infoCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 8,
		marginBottom: 20,
		gap: 10,
	},
	infoText: {
		flex: 1,
		fontSize: fontSize.xs,
	},
	inputGroup: {
		marginBottom: 16,
	},
	label: {
		fontSize: fontSize.sm,
		fontWeight: '600',
		marginBottom: 8,
	},
	input: {
		padding: 14,
		borderRadius: 8,
		fontSize: fontSize.sm,
		borderWidth: 1,
	},
	buttonContainer: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 24,
	},
	cancelButton: {
		flex: 1,
		padding: 14,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
	},
	cancelButtonText: {
		fontSize: fontSize.sm,
		fontWeight: '600',
	},
	createButton: {
		flex: 1,
		padding: 14,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonIcon: {
		marginRight: 6,
	},
	createButtonText: {
		color: '#fff',
		fontSize: fontSize.sm,
		fontWeight: '600',
	},
})

export default CreateTrackModal

