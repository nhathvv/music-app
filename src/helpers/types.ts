import { Track } from 'react-native-track-player'

export type Playlist = {
	_id?: string
	name: string
	tracks: Track[]
	artworkPreview: string
}

export type UserPlaylist = {
	_id: string
	name: string
	description?: string
	artwork?: string
	isPublic: boolean
	tracks: Track[]
	trackCount: number
	createdAt: string
	updatedAt: string
}

export type Artist = {
	name: string
	tracks: Track[]
}

export type TrackWithPlaylist = Track & {
	_id?: string
	playlist?: string[]
}
