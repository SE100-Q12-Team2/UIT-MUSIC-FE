import { Artist, Playlist, Song } from "@/features/home/types/home.types";

// Helper to get consistent images
const getImg = (id: number, w = 300, h = 300) => `https://picsum.photos/id/${id}/${w}/${h}`;

export const RECENTLY_PLAYED_BANNERS = [
  { id: '1', title: 'Recently Listened', coverUrl: getImg(10, 600, 300), accent: 'from-blue-900 to-black' },
  { id: '2', title: 'Most Listened', coverUrl: getImg(20, 600, 300), accent: 'from-purple-900 to-black' },
  { id: '3', title: 'Liked Tracks', coverUrl: getImg(30, 600, 300), accent: 'from-orange-900 to-black' },
];

export const TAILORED_PLAYLISTS: Playlist[] = [
  { id: '1', title: 'Arcane', subtitle: '86 Tracks', coverUrl: getImg(40) },
  { id: '2', title: 'Eyes', subtitle: '256 Tracks', coverUrl: getImg(41) },
  { id: '3', title: 'No Shame', subtitle: '98 Tracks', coverUrl: getImg(42) },
  { id: '4', title: 'Till Dusk', subtitle: '42 Tracks', coverUrl: getImg(43) },
  { id: '5', title: 'V.E.T', subtitle: '87 Tracks', coverUrl: getImg(44) },
];

export const PERSONAL_SPACE: Playlist[] = [
  { id: '1', title: 'Name Of Playlist', subtitle: '24 Tracks', coverUrl: getImg(50) },
  { id: '2', title: 'Name Of Playlist', subtitle: '24 Tracks', coverUrl: getImg(51) },
  { id: '3', title: 'Name Of Playlist', subtitle: '24 Tracks', coverUrl: getImg(52) },
  { id: '4', title: 'Name Of Playlist', subtitle: '24 Tracks', coverUrl: getImg(53) },
  { id: '5', title: 'Name Of Playlist', subtitle: '24 Tracks', coverUrl: getImg(54) },
];

export const ARTIST_UPDATES: Playlist[] = [
  { id: '1', title: 'The Tortured Poets...', subtitle: 'Taylor Swift', coverUrl: getImg(60) },
  { id: '2', title: 'The Tortured Poets...', subtitle: 'Taylor Swift', coverUrl: getImg(61) },
  { id: '3', title: 'The Tortured Poets...', subtitle: 'Taylor Swift', coverUrl: getImg(62) },
  { id: '4', title: 'The Tortured Poets...', subtitle: 'Taylor Swift', coverUrl: getImg(63) },
];

export const DAILY_PICK_SONGS: Song[] = [
  { id: '1', title: 'Chihiro', artist: 'Billie Eilish', album: 'Hit Me Hard and Soft', duration: '3:48', coverUrl: getImg(70), isLiked: true },
  { id: '2', title: 'Chihiro', artist: 'Billie Eilish', album: 'Hit Me Hard and Soft', duration: '3:48', coverUrl: getImg(71), isLiked: true },
  { id: '3', title: 'Chihiro', artist: 'Billie Eilish', album: 'Hit Me Hard and Soft', duration: '3:48', coverUrl: getImg(72), isLiked: true },
  { id: '4', title: 'Chihiro', artist: 'Billie Eilish', album: 'Hit Me Hard and Soft', duration: '3:48', coverUrl: getImg(73), isLiked: true },
  { id: '5', title: 'Chihiro', artist: 'Billie Eilish', album: 'Hit Me Hard and Soft', duration: '3:48', coverUrl: getImg(74), isLiked: true },
];

export const ARTISTS_FOLLOW: Artist[] = [
  { id: '1', name: 'NF', imageUrl: getImg(80) },
  { id: '2', name: 'ed sheeran', imageUrl: getImg(81) },
  { id: '3', name: 'drake', imageUrl: getImg(82) },
  { id: '4', name: 'Travis scott', imageUrl: getImg(83) },
  { id: '5', name: 'Billie eilish', imageUrl: getImg(84) },
];

export const GENRES = [
  { id: '1', title: 'Pop', coverUrl: getImg(90, 400, 150) },
  { id: '2', title: 'Hip-Hop/Rap', coverUrl: getImg(91, 400, 150) },
  { id: '3', title: 'Latin Music', coverUrl: getImg(92, 400, 150) },
];

export const QUEUE_LIST: Song[] = [
  { id: '1', title: 'idfc', artist: 'Blackbear', duration: '3:48', coverUrl: getImg(101) },
  { id: '2', title: 'So Low', artist: 'SZA', duration: '3:12', coverUrl: getImg(102) },
  { id: '3', title: 'Chihiro', artist: 'Billie Eilish', duration: '3:48', coverUrl: getImg(103) },
  { id: '4', title: 'Drama', artist: 'Roy Woods', duration: '2:55', coverUrl: getImg(104) },
  { id: '5', title: 'Miracles', artist: 'Stalking Gia', duration: '3:30', coverUrl: getImg(105) },
  { id: '6', title: 'Ride', artist: 'Twenty One Pilots', duration: '3:34', coverUrl: getImg(106) },
  { id: '7', title: 'Where Is My Love', artist: 'SYML', duration: '3:22', coverUrl: getImg(107) },
  { id: '8', title: 'Feel Something', artist: 'Jaymes Young', duration: '3:40', coverUrl: getImg(108) },
];