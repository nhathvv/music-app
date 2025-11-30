# Music Player - Workflow Diagrams

## 1. Sơ đồ Kiến trúc Tổng quan (System Architecture)

```mermaid
flowchart TB
    subgraph UI["📱 UI Layer"]
        Tabs["Tab Navigation"]
        Songs["Songs Screen"]
        Favorites["Favorites Screen"]
        Playlists["Playlists Screen"]
        Artists["Artists Screen"]
        Player["Player Screen"]
        FloatingPlayer["Floating Player"]
        Modal["Add to Playlist Modal"]
    end

    subgraph State["🗄️ State Management (Zustand)"]
        LibraryStore["Library Store\n- tracks\n- toggleFavorite\n- addToPlaylist"]
        QueueStore["Queue Store\n- activeQueueId\n- setActiveQueueId"]
    end

    subgraph Audio["🎵 Audio Engine"]
        TrackPlayer["React Native Track Player"]
        PlaybackService["Playback Service\n- Remote Events"]
    end

    subgraph Data["💾 Data Layer"]
        JSON["library.json\n(Music Data)"]
    end

    Tabs --> Songs & Favorites & Playlists & Artists
    Songs & Favorites & Playlists & Artists --> FloatingPlayer
    FloatingPlayer --> Player
    Songs & Favorites & Playlists & Artists --> Modal

    Songs & Favorites & Playlists & Artists --> LibraryStore
    LibraryStore --> JSON
    
    Songs & Favorites & Playlists & Artists --> QueueStore
    Player --> TrackPlayer
    FloatingPlayer --> TrackPlayer
    TrackPlayer --> PlaybackService
```

## 2. Luồng Điều hướng (Navigation Flow)

```mermaid
flowchart LR
    subgraph MainTabs["Main Tab Navigation"]
        direction TB
        F["❤️ Favorites"]
        P["📋 Playlists"]
        S["🎵 Songs"]
        A["👥 Artists"]
    end

    subgraph SubScreens["Sub Screens"]
        PD["Playlist Detail"]
        AD["Artist Detail"]
    end

    subgraph Modals["Modal Screens"]
        PlayerModal["🎧 Full Player\n(Card Presentation)"]
        AddPlaylist["➕ Add to Playlist\n(Modal Presentation)"]
    end

    F --> PlayerModal
    P --> PD --> PlayerModal
    S --> PlayerModal
    A --> AD --> PlayerModal

    F & S & PD & AD --> AddPlaylist

    PlayerModal -.->|"Swipe Down"| MainTabs
    AddPlaylist -.->|"Dismiss"| MainTabs
```

## 3. Luồng Phát nhạc (Music Playback Flow)

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant TL as TracksList
    participant QS as Queue Store
    participant TP as TrackPlayer
    participant PS as Playback Service

    U->>TL: Tap on Track
    TL->>TL: Find track index
    
    alt Is changing queue
        TL->>TP: reset()
        TL->>TP: add(selectedTrack)
        TL->>TP: add(afterTracks)
        TL->>TP: add(beforeTracks)
        TL->>TP: play()
        TL->>QS: setActiveQueueId(id)
    else Same queue
        TL->>TP: skip(trackIndex)
        TL->>TP: play()
    end

    TP-->>PS: Playback Started
    PS-->>U: 🎵 Music Playing
```

## 4. Luồng Quản lý Yêu thích (Favorite Management Flow)

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant C as Component
    participant LS as Library Store
    participant TP as TrackPlayer

    U->>C: Toggle Favorite
    C->>LS: toggleTrackFavorite(track)
    LS->>LS: Update track.rating (0↔1)
    LS-->>C: State Updated
    
    alt On Player Screen
        C->>TP: updateMetadataForTrack()
    end
    
    C-->>U: ❤️ UI Updated
```

## 5. Luồng Thêm vào Playlist (Add to Playlist Flow)

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant TSM as Track Shortcut Menu
    participant Modal as Add to Playlist Modal
    participant LS as Library Store
    participant QS as Queue Store
    participant TP as TrackPlayer

    U->>TSM: Long Press Track
    TSM->>TSM: Show Context Menu
    U->>TSM: Select "Add to Playlist"
    TSM->>Modal: Navigate with trackUrl

    Modal->>LS: Get available playlists
    LS-->>Modal: Playlists without this track
    Modal-->>U: Display playlist options

    U->>Modal: Select Playlist
    Modal->>LS: addToPlaylist(track, playlistName)
    LS->>LS: Add playlistName to track.playlist[]

    alt Current queue is selected playlist
        Modal->>TP: add(track) to queue end
    end

    Modal->>Modal: router.dismiss()
    Modal-->>U: ✅ Track added
```

## 6. Luồng Khởi tạo App (App Initialization Flow)

```mermaid
flowchart TB
    Start([App Launch]) --> Splash[Show Splash Screen]
    Splash --> Register[Register Playback Service]
    Register --> Setup[Setup TrackPlayer]
    
    Setup --> Config[Configure Player:\n- Cache: 10MB\n- Rating: Heart\n- Capabilities]
    Config --> Volume[Set Volume: 30%]
    Volume --> Repeat[Set Repeat: Queue]
    
    Repeat --> Hide[Hide Splash Screen]
    Hide --> Ready([App Ready])
    
    subgraph PlaybackService["Playback Service Events"]
        E1[RemotePlay → play()]
        E2[RemotePause → pause()]
        E3[RemoteStop → stop()]
        E4[RemoteNext → skipToNext()]
        E5[RemotePrevious → skipToPrevious()]
    end
    
    Register -.-> PlaybackService
```

## 7. Sơ đồ State Management (State Flow)

```mermaid
flowchart TB
    subgraph LibraryStore["Library Store"]
        Tracks["tracks: Track[]"]
        Toggle["toggleTrackFavorite()"]
        Add["addToPlaylist()"]
    end

    subgraph Selectors["Selectors / Hooks"]
        UseTracks["useTracks()"]
        UseFavorites["useFavorites()"]
        UseArtists["useArtists()"]
        UsePlaylists["usePlaylists()"]
    end

    subgraph QueueStore["Queue Store"]
        ActiveQueue["activeQueueId: string"]
        SetQueue["setActiveQueueId()"]
    end

    Tracks --> UseTracks
    Tracks --> UseFavorites
    Tracks --> UseArtists
    Tracks --> UsePlaylists

    UseFavorites --> |"filter rating===1"| FavScreen["Favorites Screen"]
    UseArtists --> |"group by artist"| ArtScreen["Artists Screen"]
    UsePlaylists --> |"group by playlist"| PlayScreen["Playlists Screen"]
    UseTracks --> SongScreen["Songs Screen"]

    ActiveQueue --> TracksList["TracksList Component"]
    SetQueue --> TracksList
```

## 8. Sơ đồ Components (Component Hierarchy)

```mermaid
flowchart TB
    App["App (_layout.tsx)"]
    
    App --> SafeArea["SafeAreaProvider"]
    SafeArea --> Gesture["GestureHandlerRootView"]
    Gesture --> Stack["Stack Navigator"]
    
    Stack --> TabsLayout["Tabs Layout"]
    Stack --> PlayerScreen["Player Screen"]
    Stack --> AddToPlaylistModal["Add to Playlist Modal"]
    
    TabsLayout --> FloatingPlayer["Floating Player"]
    TabsLayout --> TabScreens["Tab Screens"]
    
    TabScreens --> Songs["Songs"]
    TabScreens --> Favorites["Favorites"]  
    TabScreens --> Playlists["Playlists"]
    TabScreens --> Artists["Artists"]
    
    Songs --> TracksList["TracksList"]
    Favorites --> TracksList
    
    Playlists --> PlaylistsList["PlaylistsList"]
    PlaylistsList --> PlaylistItem["PlaylistListItem"]
    
    Artists --> ArtistsList["Artists List"]
    
    TracksList --> TracksListItem["TracksListItem"]
    TracksListItem --> TrackShortcutsMenu["TrackShortcutsMenu"]
    
    PlayerScreen --> PlayerControls["PlayerControls"]
    PlayerScreen --> PlayerProgressBar["PlayerProgressBar"]
    PlayerScreen --> PlayerVolumeBar["PlayerVolumeBar"]
    PlayerScreen --> PlayerRepeatToggle["PlayerRepeatToggle"]
    PlayerScreen --> MovingText["MovingText"]
    
    FloatingPlayer --> MovingText
    FloatingPlayer --> PlayerControls
```

## 9. Sơ đồ Data Flow (Luồng dữ liệu)

```mermaid
flowchart LR
    subgraph DataSource["📁 Data Source"]
        JSON["library.json"]
    end

    subgraph Store["🗄️ Zustand Store"]
        State["LibraryState"]
    end

    subgraph Hooks["🪝 Custom Hooks"]
        H1["useTracks()"]
        H2["useFavorites()"]
        H3["useArtists()"]
        H4["usePlaylists()"]
    end

    subgraph Screens["📱 Screens"]
        S1["Songs Screen"]
        S2["Favorites Screen"]
        S3["Artists Screen"]
        S4["Playlists Screen"]
    end

    subgraph Player["🎵 Audio"]
        TP["TrackPlayer"]
    end

    JSON -->|"import"| State
    State -->|"select"| H1 & H2 & H3 & H4
    
    H1 --> S1
    H2 --> S2
    H3 --> S3
    H4 --> S4
    
    S1 & S2 & S3 & S4 -->|"queue tracks"| TP
    TP -->|"playback state"| S1 & S2 & S3 & S4
```

## 10. Use Case Diagram

```mermaid
flowchart TB
    User((👤 User))
    
    subgraph MusicPlayer["🎵 Music Player App"]
        UC1["Browse Songs"]
        UC2["Search Tracks"]
        UC3["Play/Pause Music"]
        UC4["Skip Next/Previous"]
        UC5["Adjust Volume"]
        UC6["Toggle Repeat Mode"]
        UC7["Mark as Favorite"]
        UC8["View Favorites"]
        UC9["Browse Artists"]
        UC10["View Artist Tracks"]
        UC11["Browse Playlists"]
        UC12["Add Track to Playlist"]
        UC13["View Playlist Tracks"]
        UC14["Control from Lock Screen"]
    end
    
    User --> UC1 & UC2 & UC3 & UC4 & UC5
    User --> UC6 & UC7 & UC8 & UC9 & UC10
    User --> UC11 & UC12 & UC13 & UC14
    
    UC3 -.->|"extends"| UC14
    UC4 -.->|"extends"| UC14
```

---

## Hướng dẫn sử dụng Diagrams

### Cách render Mermaid diagrams:

1. **GitHub/GitLab**: Copy code vào file `.md`, diagrams sẽ tự render
2. **VS Code**: Cài extension "Mermaid Preview" 
3. **Online**: Dùng [Mermaid Live Editor](https://mermaid.live/)
4. **Export PNG/SVG**: Dùng Mermaid CLI hoặc Live Editor

### Cách chèn vào báo cáo Word/PDF:
1. Mở Mermaid Live Editor
2. Paste code diagram
3. Export ra PNG/SVG
4. Chèn hình vào báo cáo

---

*Generated for Music Player React Native Project*

