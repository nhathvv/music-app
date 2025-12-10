import library from '@/assets/data/library.json'
import { unknownTrackImageUri } from '@/constants/images'
import { Artist, Playlist, TrackWithPlaylist } from '@/helpers/types'
import { api } from '@/services/api'
import { Track } from 'react-native-track-player'
import { create } from 'zustand'

interface LibraryState {
	tracks: TrackWithPlaylist[]
	isLoading: boolean
	error: string | null
	isOffline: boolean
	fetchTracks: () => Promise<void>
	toggleTrackFavorite: (track: Track) => Promise<void>
	addToPlaylist: (track: Track, playlistName: string) => Promise<void>
	setTracks: (tracks: TrackWithPlaylist[]) => void
}

export const useLibraryStore = create<LibraryState>()((set, get) => ({
	tracks: [],
	isLoading: false,
	error: null,
	isOffline: false,

	fetchTracks: async () => {
		set({ isLoading: true, error: null })
		try {
			console.log('🚀 Fetching tracks from API...')
			const response = await api.tracks.getAll({ limit: 100 })
			console.log(`✅ API connected! Loaded ${response.data.length} tracks from server`)
			set({ tracks: response.data, isLoading: false, isOffline: false })
		} catch (error) {
			console.warn('⚠️ API unavailable, using local data:', error)
			set({
				tracks: library as TrackWithPlaylist[],
				isLoading: false,
				isOffline: true,
				error: null,
			})
		}
	},

	setTracks: (tracks) => set({ tracks }),

	toggleTrackFavorite: async (track) => {
		const currentTracks = get().tracks
		const isOffline = get().isOffline
		const trackIndex = currentTracks.findIndex((t) => t.url === track.url)
		if (trackIndex === -1) return

		const currentTrack = currentTracks[trackIndex]
		const newRating = currentTrack.rating === 1 ? 0 : 1

		set({
			tracks: currentTracks.map((t) =>
				t.url === track.url ? { ...t, rating: newRating } : t
			),
		})

		if (isOffline) return

		try {
			const trackWithId = currentTracks.find((t) => t.url === track.url)
			if (trackWithId?._id) {
				await api.tracks.toggleFavorite(trackWithId._id)
			}
		} catch (error) {
			set({
				tracks: currentTracks.map((t) =>
					t.url === track.url ? { ...t, rating: currentTrack.rating } : t
				),
			})
			console.error('Failed to toggle favorite:', error)
		}
	},

	addToPlaylist: async (track, playlistName) => {
		const currentTracks = get().tracks
		const isOffline = get().isOffline

		set({
			tracks: currentTracks.map((currentTrack) => {
				if (currentTrack.url === track.url) {
					return {
						...currentTrack,
						playlist: [...(currentTrack.playlist ?? []), playlistName],
					}
				}
				return currentTrack
			}),
		})

		if (isOffline) return

		try {
			const trackWithId = currentTracks.find((t) => t.url === track.url)
			if (trackWithId?._id) {
				await api.tracks.addToPlaylist(trackWithId._id, playlistName)
			}
		} catch (error) {
			set({ tracks: currentTracks })
			console.error('Failed to add to playlist:', error)
		}
	},
}))

export const useTracks = () => useLibraryStore((state) => state.tracks)

export const useTracksLoading = () => useLibraryStore((state) => state.isLoading)

export const useTracksError = () => useLibraryStore((state) => state.error)

export const useIsOffline = () => useLibraryStore((state) => state.isOffline)

export const useFetchTracks = () => useLibraryStore((state) => state.fetchTracks)

export const useFavorites = () => {
	const favorites = useLibraryStore((state) => state.tracks.filter((track) => track.rating === 1))
	const toggleTrackFavorite = useLibraryStore((state) => state.toggleTrackFavorite)

	return {
		favorites,
		toggleTrackFavorite,
	}
}

export const useArtists = () =>
	useLibraryStore((state) => {
		return state.tracks.reduce((acc, track) => {
			const existingArtist = acc.find((artist) => artist.name === track.artist)

			if (existingArtist) {
				existingArtist.tracks.push(track)
			} else {
				acc.push({
					name: track.artist ?? 'Unknown',
					tracks: [track],
				})
			}

			return acc
		}, [] as Artist[])
	})

export const usePlaylists = () => {
	const playlists = useLibraryStore((state) => {
		return state.tracks.reduce((acc, track) => {
			track.playlist?.forEach((playlistName) => {
				const existingPlaylist = acc.find((playlist) => playlist.name === playlistName)

				if (existingPlaylist) {
					existingPlaylist.tracks.push(track)
				} else {
					acc.push({
						name: playlistName,
						tracks: [track],
						artworkPreview: track.artwork ?? unknownTrackImageUri,
					})
				}
			})

			return acc
		}, [] as Playlist[])
	})

	const addToPlaylist = useLibraryStore((state) => state.addToPlaylist)

	return { playlists, addToPlaylist }
}
