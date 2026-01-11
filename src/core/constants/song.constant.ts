export const SongOrder = {
  LATEST: 'latest',
  POPULAR: 'popular',
  TITLE: 'title',
} as const

export enum CopyRightStatus {
  CLEAR = 'Clear',
  DISPUTED = 'Disputed',
  VIOLATION = 'Violation',
  PENDING = 'Pending',
}

export type SongOrderType = (typeof SongOrder)[keyof typeof SongOrder]

