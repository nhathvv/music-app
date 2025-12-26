import { TracksList } from '@/components/TracksList'
import { screenPadding } from '@/constants/tokens'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useFetchTracks, useIsOffline, useTracks, useTracksLoading } from '@/store/library'
import { useTheme } from '@/store/theme'
import { defaultStyles } from '@/styles'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'

const SongsScreen = () => {
	const colors = useTheme()
	const router = useRouter()
	const isOffline = useIsOffline()
	const isLoading = useTracksLoading()
	const fetchTracks = useFetchTracks()
	const [refreshing, setRefreshing] = useState(false)

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await fetchTracks()
		setRefreshing(false)
	}, [fetchTracks])

	const search = useNavigationSearch({
		searchBarOptions: {
			placeholder: 'Find in songs',
		},
	})

	const tracks = useTracks()

	const filteredTracks = useMemo(() => {
		if (!search) return tracks

		return tracks.filter(trackTitleFilter(search))
	}, [search, tracks])

	const handleAddTrack = () => {
		router.push('/(modals)/createTrack')
	}

	return (
		<View style={[defaultStyles.container, { backgroundColor: colors.background }]}>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: screenPadding.horizontal }}
				refreshControl={
					<RefreshControl
						refreshing={refreshing || isLoading}
						onRefresh={onRefresh}
						tintColor={colors.primary}
						colors={[colors.primary]}
					/>
				}
			>
				<TracksList
					id={generateTracksListId('songs', search)}
					tracks={filteredTracks}
					scrollEnabled={false}
				/>
			</ScrollView>

			{!isOffline && (
				<Pressable
					style={[styles.fab, { backgroundColor: colors.primary }]}
					onPress={handleAddTrack}
				>
					<Ionicons name="add" size={28} color="#fff" />
				</Pressable>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	fab: {
		position: 'absolute',
		right: 20,
		bottom: 100,
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
})

export default SongsScreen
