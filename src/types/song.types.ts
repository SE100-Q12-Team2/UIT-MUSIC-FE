import { CopyRightStatus } from "@/core/constants/song.constant";

export interface Song {
  id: number;
  title: string;
  duration: number;
  language: string | null;
  lyrics: string | null;
  albumId: number | null;
  genreId: number | null;
  labelId: number | null;
  uploadDate: string;
  isActive: boolean;
  copyrightStatus: CopyRightStatus;
  playCount: number;
}