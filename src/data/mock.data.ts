// Mock data tạm thời để test UI/UX
// Sau này sẽ xóa và dùng API thật

const getImg = (id: number, w = 300, h = 300) => `https://picsum.photos/id/${id}/${w}/${h}`;

export const MOCK_ARTIST_UPDATES = [
  { id: '1', title: 'The Tortured Poets Department', subtitle: 'Taylor Swift', coverUrl: getImg(60) },
  { id: '2', title: 'Hit Me Hard and Soft', subtitle: 'Billie Eilish', coverUrl: getImg(61) },
  { id: '3', title: 'The Tortured Poets Department', subtitle: 'Taylor Swift', coverUrl: getImg(62) },
  { id: '4', title: 'Midnights', subtitle: 'Taylor Swift', coverUrl: getImg(63) },
];

export const MOCK_ARTISTS_FOLLOW = [
  { id: '1', name: 'NF', imageUrl: getImg(80) },
  { id: '2', name: 'Ed Sheeran', imageUrl: getImg(81) },
  { id: '3', name: 'Drake', imageUrl: getImg(82) },
  { id: '4', name: 'Travis Scott', imageUrl: getImg(83) },
  { id: '5', name: 'Billie Eilish', imageUrl: getImg(84) },
  { id: '6', name: 'Taylor Swift', imageUrl: getImg(85) },
];

export const MOCK_GENRES = [
  { id: '1', title: 'Pop', coverUrl: getImg(90, 400, 150) },
  { id: '2', title: 'Hip-Hop/Rap', coverUrl: getImg(91, 400, 150) },
  { id: '3', title: 'Latin Music', coverUrl: getImg(92, 400, 150) },
  { id: '4', title: 'K-Pop', coverUrl: getImg(93, 400, 150) },
  { id: '5', title: 'Rock', coverUrl: getImg(94, 400, 150) },
  { id: '6', title: 'Electronic', coverUrl: getImg(95, 400, 150) },
];

export const MOCK_SONGS = [
  { id: '1', title: 'Chihiro', artist: 'Billie Eilish', album: 'Hit Me Hard and Soft', duration: 228, coverUrl: getImg(70), audioUrl: '' },
  { id: '2', title: 'Lunch', artist: 'Billie Eilish', album: 'Hit Me Hard and Soft', duration: 181, coverUrl: getImg(71), audioUrl: '' },
  { id: '3', title: 'Birds of a Feather', artist: 'Billie Eilish', album: 'Hit Me Hard and Soft', duration: 208, coverUrl: getImg(72), audioUrl: '' },
  { id: '4', title: 'Wildflower', artist: 'Billie Eilish', album: 'Hit Me Hard and Soft', duration: 195, coverUrl: getImg(73), audioUrl: '' },
  { id: '5', title: 'The Greatest', artist: 'Billie Eilish', album: 'Hit Me Hard and Soft', duration: 245, coverUrl: getImg(74), audioUrl: '' },
  { id: '6', title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', duration: 201, coverUrl: getImg(75), audioUrl: '' },
  { id: '7', title: 'Lavender Haze', artist: 'Taylor Swift', album: 'Midnights', duration: 223, coverUrl: getImg(76), audioUrl: '' },
  { id: '8', title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", duration: 167, coverUrl: getImg(77), audioUrl: '' },
  { id: '9', title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: 174, coverUrl: getImg(78), audioUrl: '' },
  { id: '10', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: 200, coverUrl: getImg(79), audioUrl: '' },
];

export const MOCK_PLAYLISTS = [
  { id: '1', name: 'Arcane', description: 'Music from Arcane', coverUrl: getImg(40), trackCount: 86, duration: 12345, isPublic: true },
  { id: '2', name: 'Eyes', description: 'Chill vibes', coverUrl: getImg(41), trackCount: 256, duration: 23456, isPublic: true },
  { id: '3', name: 'No Shame', description: 'Upbeat playlist', coverUrl: getImg(42), trackCount: 98, duration: 18765, isPublic: true },
  { id: '4', name: 'Till Dusk', description: 'Evening vibes', coverUrl: getImg(43), trackCount: 42, duration: 9876, isPublic: true },
  { id: '5', name: 'V.E.T', description: 'Vibes Every Time', coverUrl: getImg(44), trackCount: 87, duration: 15678, isPublic: true },
  { id: '6', name: 'Name Of Playlist', description: 'Personal collection', coverUrl: getImg(50), trackCount: 24, duration: 5432, isPublic: false },
  { id: '7', name: 'RADIO HEAD', description: 'Radio hits', coverUrl: getImg(51), trackCount: 24, duration: 5432, isPublic: true },
  { id: '8', name: 'Smoky Vibes', description: 'Chill playlist', coverUrl: getImg(52), trackCount: 24, duration: 5432, isPublic: true },
  { id: '9', name: 'Heart Beats', description: 'Love songs', coverUrl: getImg(53), trackCount: 24, duration: 5432, isPublic: true },
  { id: '10', name: 'Stage Lights', description: 'Concert vibes', coverUrl: getImg(54), trackCount: 24, duration: 5432, isPublic: true },
];

export const MOCK_ALBUMS = [
  { id: '1', title: 'Hit Me Hard and Soft', artist: 'Billie Eilish', coverUrl: getImg(100), trackCount: 10, releaseDate: '2024-05-17' },
  { id: '2', title: 'Midnights', artist: 'Taylor Swift', coverUrl: getImg(101), trackCount: 13, releaseDate: '2022-10-21' },
  { id: '3', title: "Harry's House", artist: 'Harry Styles', coverUrl: getImg(102), trackCount: 13, releaseDate: '2022-05-20' },
  { id: '4', title: 'After Hours', artist: 'The Weeknd', coverUrl: getImg(103), trackCount: 14, releaseDate: '2020-03-20' },
];

export const MOCK_ARTISTS = [
  { id: '1', name: 'Billie Eilish', imageUrl: getImg(110), followers: 50000000 },
  { id: '2', name: 'Taylor Swift', imageUrl: getImg(111), followers: 100000000 },
  { id: '3', name: 'Harry Styles', imageUrl: getImg(112), followers: 45000000 },
  { id: '4', name: 'The Weeknd', imageUrl: getImg(113), followers: 60000000 },
  { id: '5', name: 'Drake', imageUrl: getImg(114), followers: 80000000 },
];






