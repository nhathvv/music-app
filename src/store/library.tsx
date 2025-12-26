import library from '@/assets/data/library.json'
import { unknownTrackImageUri } from '@/constants/images'
import { Artist, Playlist, TrackWithPlaylist, UserPlaylist } from '@/helpers/types'
import { api, UserPlaylistResponse } from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Track } from 'react-native-track-player'
import { create } from 'zustand'

const DEVICE_ID_KEY = '@music_app_device_id'

const getOrCreateDeviceId = async (): Promise<string> => {
	let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY)
	if (!deviceId) {
		deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
		await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId)
	}
	return deviceId
}

const mapUserPlaylistResponse = (playlist: UserPlaylistResponse): UserPlaylist => ({
	_id: playlist._id,
	name: playlist.name,
	description: playlist.description,
	artwork: playlist.artwork,
	isPublic: playlist.isPublic,
	tracks: (playlist.tracks || []).map((t) => ({
		_id: t._id,
		url: t.url,
		title: t.title,
		artist: t.artist,
		artwork: t.artwork,
		rating: t.rating,
		playlist: t.playlist,
		duration: t.duration,
	})),
	trackCount: playlist.trackCount || 0,
	createdAt: playlist.createdAt,
	updatedAt: playlist.updatedAt,
})

export interface CreateTrackData {
	url: string
	title: string
	artist?: string
	artwork?: string
	rating?: number
	playlist?: string[]
	duration?: number
	genre?: string
}

interface LibraryState {
	tracks: TrackWithPlaylist[]
	userPlaylists: UserPlaylist[]
	deviceId: string | null
	isLoading: boolean
	error: string | null
	isOffline: boolean
	fetchTracks: () => Promise<void>
	fetchUserPlaylists: () => Promise<void>
	toggleTrackFavorite: (track: Track) => Promise<void>
	addToPlaylist: (track: Track, playlistId: string) => Promise<void>
	removeFromPlaylist: (track: Track, playlistId: string) => Promise<void>
	createPlaylist: (playlistName: string) => Promise<UserPlaylist | null>
	deletePlaylist: (playlistId: string) => Promise<void>
	setTracks: (tracks: TrackWithPlaylist[]) => void
	createTrack: (data: CreateTrackData) => Promise<TrackWithPlaylist | null>
	updateTrack: (id: string, data: Partial<CreateTrackData>) => Promise<TrackWithPlaylist | null>
	deleteTrack: (id: string) => Promise<boolean>
}

export const useLibraryStore = create<LibraryState>()((set, get) => ({
	tracks: [],
	userPlaylists: [],
	deviceId: null,
	isLoading: false,
	error: null,
	isOffline: false,

	fetchTracks: async () => {
		set({ isLoading: true, error: null })
		try {
			console.log('🚀 Fetching tracks from API...')
			const response = await api.tracks.getAll({ limit: 100 })
			console.log(`✅ API connected! Loaded ${response.data.length} tracks from server`)

			const deviceId = await getOrCreateDeviceId()
			set({ tracks: response.data, deviceId, isLoading: false, isOffline: false })

			get().fetchUserPlaylists()
		} catch (error) {
			console.warn('⚠️ API unavailable, using local data:', error)

			set({
				tracks: library as TrackWithPlaylist[],
				userPlaylists: [],
				isLoading: false,
				isOffline: true,
				error: null,
			})
		}
	},

	fetchUserPlaylists: async () => {
		const isOffline = get().isOffline
		if (isOffline) return

		try {
			const deviceId = get().deviceId || (await getOrCreateDeviceId())
			console.log('📂 Fetching user playlists...')
			const playlists = await api.userPlaylists.getAll(deviceId)
			const mappedPlaylists = playlists.map(mapUserPlaylistResponse)
			console.log(`✅ Loaded ${mappedPlaylists.length} user playlists`)
			set({ userPlaylists: mappedPlaylists, deviceId })
		} catch (error) {
			console.error('Failed to fetch user playlists:', error)
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

	addToPlaylist: async (track, playlistId) => {
		const currentPlaylists = get().userPlaylists
		const isOffline = get().isOffline
		const trackWithId = get().tracks.find((t) => t.url === track.url)

		set({
			userPlaylists: currentPlaylists.map((playlist) => {
				if (playlist._id === playlistId) {
					return {
						...playlist,
						tracks: [...playlist.tracks, track as TrackWithPlaylist],
						trackCount: playlist.trackCount + 1,
					}
				}
				return playlist
			}),
		})

		if (isOffline || !trackWithId?._id) return

		try {
			await api.userPlaylists.addTrack(playlistId, trackWithId._id)
			console.log(`✅ Added track to playlist`)
		} catch (error) {
			set({ userPlaylists: currentPlaylists })
			console.error('Failed to add to playlist:', error)
		}
	},

	removeFromPlaylist: async (track, playlistId) => {
		const currentPlaylists = get().userPlaylists
		const isOffline = get().isOffline
		const trackWithId = get().tracks.find((t) => t.url === track.url)

		set({
			userPlaylists: currentPlaylists.map((playlist) => {
				if (playlist._id === playlistId) {
					return {
						...playlist,
						tracks: playlist.tracks.filter((t) => t.url !== track.url),
						trackCount: playlist.trackCount - 1,
					}
				}
				return playlist
			}),
		})

		if (isOffline || !trackWithId?._id) return

		try {
			await api.userPlaylists.removeTrack(playlistId, trackWithId._id)
			console.log(`✅ Removed track from playlist`)
		} catch (error) {
			set({ userPlaylists: currentPlaylists })
			console.error('Failed to remove from playlist:', error)
		}
	},

	createPlaylist: async (playlistName) => {
		const isOffline = get().isOffline
		if (isOffline) {
			console.warn('Cannot create playlist while offline')
			return null
		}

		try {
			const deviceId = get().deviceId || (await getOrCreateDeviceId())
			console.log(`📝 Creating playlist: ${playlistName}`)
			const response = await api.userPlaylists.create({ name: playlistName, deviceId })
			const newPlaylist = mapUserPlaylistResponse(response)

			set({ userPlaylists: [...get().userPlaylists, newPlaylist] })
			console.log(`✅ Created playlist: ${playlistName}`)
			return newPlaylist
		} catch (error) {
			console.error('Failed to create playlist:', error)
			throw error
		}
	},

	deletePlaylist: async (playlistId) => {
		const currentPlaylists = get().userPlaylists
		const isOffline = get().isOffline

		set({ userPlaylists: currentPlaylists.filter((p) => p._id !== playlistId) })

		if (isOffline) return

		try {
			await api.userPlaylists.delete(playlistId)
			console.log(`🗑️ Deleted playlist`)
		} catch (error) {
			set({ userPlaylists: currentPlaylists })
			console.error('Failed to delete playlist:', error)
		}
	},

	createTrack: async (data) => {
		const isOffline = get().isOffline
		if (isOffline) {
			console.warn('Cannot create track while offline')
			return null
		}

		try {
			console.log(`🎵 Creating track: ${data.title}`)
			const newTrack = await api.tracks.create(data)
			set({ tracks: [...get().tracks, newTrack] })
			console.log(`✅ Created track: ${data.title}`)
			return newTrack
		} catch (error) {
			console.error('Failed to create track:', error)
			throw error
		}
	},

	updateTrack: async (id, data) => {
		const isOffline = get().isOffline
		const currentTracks = get().tracks

		if (isOffline) {
			console.warn('Cannot update track while offline')
			return null
		}

		try {
			console.log(`📝 Updating track: ${id}`)
			const updatedTrack = await api.tracks.update(id, data)
			set({
				tracks: currentTracks.map((t) => (t._id === id ? updatedTrack : t)),
			})
			console.log(`✅ Updated track: ${updatedTrack.title}`)
			return updatedTrack
		} catch (error) {
			console.error('Failed to update track:', error)
			throw error
		}
	},

	deleteTrack: async (id) => {
		const isOffline = get().isOffline
		const currentTracks = get().tracks

		if (isOffline) {
			console.warn('Cannot delete track while offline')
			return false
		}

		set({ tracks: currentTracks.filter((t) => t._id !== id) })

		try {
			await api.tracks.delete(id)
			console.log(`🗑️ Deleted track`)
			return true
		} catch (error) {
			set({ tracks: currentTracks })
			console.error('Failed to delete track:', error)
			return false
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

export const useUserPlaylists = () => {
	const userPlaylists = useLibraryStore((state) => state.userPlaylists)
	const addToPlaylist = useLibraryStore((state) => state.addToPlaylist)
	const removeFromPlaylist = useLibraryStore((state) => state.removeFromPlaylist)
	const createPlaylist = useLibraryStore((state) => state.createPlaylist)
	const deletePlaylist = useLibraryStore((state) => state.deletePlaylist)

	return { userPlaylists, addToPlaylist, removeFromPlaylist, createPlaylist, deletePlaylist }
}

export const usePlaylists = () => {
	const userPlaylists = useLibraryStore((state) => state.userPlaylists)

	const playlists: Playlist[] = userPlaylists.map((up) => ({
		name: up.name,
		tracks: up.tracks,
		artworkPreview: up.artwork || (up.tracks[0]?.artwork as string) || unknownTrackImageUri,
		_id: up._id,
	}))

	const addToPlaylist = useLibraryStore((state) => state.addToPlaylist)
	const removeFromPlaylist = useLibraryStore((state) => state.removeFromPlaylist)
	const createPlaylist = useLibraryStore((state) => state.createPlaylist)
	const deletePlaylist = useLibraryStore((state) => state.deletePlaylist)

	return { playlists, addToPlaylist, removeFromPlaylist, createPlaylist, deletePlaylist }
}

export const useTrackActions = () => {
	const createTrack = useLibraryStore((state) => state.createTrack)
	const updateTrack = useLibraryStore((state) => state.updateTrack)
	const deleteTrack = useLibraryStore((state) => state.deleteTrack)
	const isOffline = useLibraryStore((state) => state.isOffline)

	return { createTrack, updateTrack, deleteTrack, isOffline }
}
