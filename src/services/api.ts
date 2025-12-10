import { Artist, Playlist, TrackWithPlaylist } from '@/helpers/types'
import { Platform } from 'react-native'

const getApiBaseUrl = () => {
	if (!__DEV__) {
		return 'https://your-production-url.com/api'
	}
	if (Platform.OS === 'ios') {
		return 'http://localhost:3000/api'
	}
	return 'http://10.0.2.2:3000/api'
}

const API_BASE_URL = getApiBaseUrl()

interface PaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	limit: number
}

interface TrackResponse extends TrackWithPlaylist {
	_id: string
}

interface ArtistResponse {
	name: string
	tracks: TrackResponse[]
	trackCount: number
	artworkPreview?: string
}

interface PlaylistResponse {
	name: string
	tracks: TrackResponse[]
	trackCount: number
	artworkPreview?: string
}

export interface UserPlaylistResponse {
	_id: string
	name: string
	description?: string
	artwork?: string
	isPublic: boolean
	tracks: TrackResponse[]
	trackCount: number
	createdAt: string
	updatedAt: string
}

const handleResponse = async <T>(response: Response): Promise<T> => {
	if (!response.ok) {
		const error = await response.json().catch(() => ({ message: 'Unknown error' }))
		throw new Error(error.message || `HTTP error! status: ${response.status}`)
	}
	return response.json()
}

const mapTrackResponse = (track: TrackResponse): TrackWithPlaylist => ({
	_id: track._id,
	url: track.url,
	title: track.title,
	artist: track.artist,
	artwork: track.artwork,
	rating: track.rating,
	playlist: track.playlist,
	duration: track.duration,
})

export const api = {
	tracks: {
		getAll: async (params?: {
			search?: string
			artist?: string
			playlist?: string
			rating?: number
			page?: number
			limit?: number
		}): Promise<PaginatedResponse<TrackWithPlaylist>> => {
			const searchParams = new URLSearchParams()
			if (params?.search) searchParams.append('search', params.search)
			if (params?.artist) searchParams.append('artist', params.artist)
			if (params?.playlist) searchParams.append('playlist', params.playlist)
			if (params?.rating !== undefined) searchParams.append('rating', params.rating.toString())
			if (params?.page) searchParams.append('page', params.page.toString())
			if (params?.limit) searchParams.append('limit', params.limit.toString())

			const url = `${API_BASE_URL}/tracks${searchParams.toString() ? `?${searchParams}` : ''}`
			const response = await fetch(url)
			const result = await handleResponse<PaginatedResponse<TrackResponse>>(response)

			return {
				...result,
				data: result.data.map(mapTrackResponse),
			}
		},

		getById: async (id: string): Promise<TrackWithPlaylist> => {
			const response = await fetch(`${API_BASE_URL}/tracks/${id}`)
			const track = await handleResponse<TrackResponse>(response)
			return mapTrackResponse(track)
		},

		toggleFavorite: async (id: string): Promise<TrackWithPlaylist> => {
			const response = await fetch(`${API_BASE_URL}/tracks/${id}/favorite`, {
				method: 'PATCH',
			})
			const track = await handleResponse<TrackResponse>(response)
			return mapTrackResponse(track)
		},

		addToPlaylist: async (id: string, playlistName: string): Promise<TrackWithPlaylist> => {
			const response = await fetch(`${API_BASE_URL}/tracks/${id}/playlist/${encodeURIComponent(playlistName)}`, {
				method: 'PATCH',
			})
			const track = await handleResponse<TrackResponse>(response)
			return mapTrackResponse(track)
		},

		removeFromPlaylist: async (id: string, playlistName: string): Promise<TrackWithPlaylist> => {
			const response = await fetch(`${API_BASE_URL}/tracks/${id}/playlist/${encodeURIComponent(playlistName)}`, {
				method: 'DELETE',
			})
			const track = await handleResponse<TrackResponse>(response)
			return mapTrackResponse(track)
		},
	},

	favorites: {
		getAll: async (): Promise<TrackWithPlaylist[]> => {
			const response = await fetch(`${API_BASE_URL}/favorites`)
			const tracks = await handleResponse<TrackResponse[]>(response)
			return tracks.map(mapTrackResponse)
		},

		toggle: async (trackId: string): Promise<TrackWithPlaylist> => {
			const response = await fetch(`${API_BASE_URL}/favorites/${trackId}/toggle`, {
				method: 'PATCH',
			})
			const track = await handleResponse<TrackResponse>(response)
			return mapTrackResponse(track)
		},
	},

	artists: {
		getAll: async (params?: {
			search?: string
			page?: number
			limit?: number
		}): Promise<PaginatedResponse<Artist>> => {
			const searchParams = new URLSearchParams()
			if (params?.search) searchParams.append('search', params.search)
			if (params?.page) searchParams.append('page', params.page.toString())
			if (params?.limit) searchParams.append('limit', params.limit.toString())

			const url = `${API_BASE_URL}/artists${searchParams.toString() ? `?${searchParams}` : ''}`
			const response = await fetch(url)
			const result = await handleResponse<PaginatedResponse<ArtistResponse>>(response)

			return {
				...result,
				data: result.data.map((artist) => ({
					name: artist.name,
					tracks: artist.tracks.map(mapTrackResponse),
				})),
			}
		},

		getByName: async (name: string): Promise<Artist> => {
			const response = await fetch(`${API_BASE_URL}/artists/${encodeURIComponent(name)}`)
			const artist = await handleResponse<ArtistResponse>(response)
			return {
				name: artist.name,
				tracks: artist.tracks.map(mapTrackResponse),
			}
		},
	},

	playlists: {
		getAll: async (params?: {
			search?: string
			page?: number
			limit?: number
		}): Promise<PaginatedResponse<Playlist>> => {
			const searchParams = new URLSearchParams()
			if (params?.search) searchParams.append('search', params.search)
			if (params?.page) searchParams.append('page', params.page.toString())
			if (params?.limit) searchParams.append('limit', params.limit.toString())

			const url = `${API_BASE_URL}/playlists${searchParams.toString() ? `?${searchParams}` : ''}`
			const response = await fetch(url)
			const result = await handleResponse<PaginatedResponse<PlaylistResponse>>(response)

			return {
				...result,
				data: result.data.map((playlist) => ({
					name: playlist.name,
					tracks: playlist.tracks.map(mapTrackResponse),
					artworkPreview: playlist.artworkPreview || '',
				})),
			}
		},

		getByName: async (name: string): Promise<Playlist> => {
			const response = await fetch(`${API_BASE_URL}/playlists/${encodeURIComponent(name)}`)
			const playlist = await handleResponse<PlaylistResponse>(response)
			return {
				name: playlist.name,
				tracks: playlist.tracks.map(mapTrackResponse),
				artworkPreview: playlist.artworkPreview || '',
			}
		},

		addTrack: async (playlistName: string, trackId: string): Promise<TrackWithPlaylist> => {
			const response = await fetch(
				`${API_BASE_URL}/playlists/${encodeURIComponent(playlistName)}/tracks/${trackId}`,
				{ method: 'POST' }
			)
			const track = await handleResponse<TrackResponse>(response)
			return mapTrackResponse(track)
		},

		removeTrack: async (playlistName: string, trackId: string): Promise<TrackWithPlaylist> => {
			const response = await fetch(
				`${API_BASE_URL}/playlists/${encodeURIComponent(playlistName)}/tracks/${trackId}`,
				{ method: 'DELETE' }
			)
			const track = await handleResponse<TrackResponse>(response)
			return mapTrackResponse(track)
		},
	},

	userPlaylists: {
		getAll: async (deviceId?: string): Promise<UserPlaylistResponse[]> => {
			const searchParams = new URLSearchParams()
			if (deviceId) searchParams.append('deviceId', deviceId)

			const url = `${API_BASE_URL}/user-playlists${searchParams.toString() ? `?${searchParams}` : ''}`
			const response = await fetch(url)
			return handleResponse<UserPlaylistResponse[]>(response)
		},

		getById: async (id: string): Promise<UserPlaylistResponse> => {
			const response = await fetch(`${API_BASE_URL}/user-playlists/${id}`)
			return handleResponse<UserPlaylistResponse>(response)
		},

		create: async (data: {
			name: string
			deviceId?: string
			description?: string
			trackIds?: string[]
		}): Promise<UserPlaylistResponse> => {
			const response = await fetch(`${API_BASE_URL}/user-playlists`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			return handleResponse<UserPlaylistResponse>(response)
		},

		update: async (
			id: string,
			data: { name?: string; description?: string }
		): Promise<UserPlaylistResponse> => {
			const response = await fetch(`${API_BASE_URL}/user-playlists/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			return handleResponse<UserPlaylistResponse>(response)
		},

		delete: async (id: string): Promise<void> => {
			const response = await fetch(`${API_BASE_URL}/user-playlists/${id}`, {
				method: 'DELETE',
			})
			if (!response.ok) {
				const error = await response.json().catch(() => ({ message: 'Unknown error' }))
				throw new Error(error.message || `HTTP error! status: ${response.status}`)
			}
		},

		addTrack: async (playlistId: string, trackId: string): Promise<UserPlaylistResponse> => {
			const response = await fetch(`${API_BASE_URL}/user-playlists/${playlistId}/tracks`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ trackId }),
			})
			return handleResponse<UserPlaylistResponse>(response)
		},

		removeTrack: async (playlistId: string, trackId: string): Promise<UserPlaylistResponse> => {
			const response = await fetch(`${API_BASE_URL}/user-playlists/${playlistId}/tracks/${trackId}`, {
				method: 'DELETE',
			})
			return handleResponse<UserPlaylistResponse>(response)
		},
	},
}

