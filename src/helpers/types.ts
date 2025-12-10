import { Track } from 'react-native-track-player'

export type Playlist = {
	name: string
	tracks: Track[]
	artworkPreview: string
}

export type Artist = {
	name: string
	tracks: Track[]
}

export type TrackWithPlaylist = Track & {
	_id?: string
	playlist?: string[]
}
