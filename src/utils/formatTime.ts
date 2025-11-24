/**
 * Format seconds to MM:SS format
 * @param seconds - number of seconds
 * @returns formatted time string (e.g., "3:45")
 */
export const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Format seconds to HH:MM:SS format
 * @param seconds - number of seconds
 * @returns formatted time string (e.g., "1:23:45")
 */
export const formatTimeLong = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00:00";

    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    }

    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Parse time string (MM:SS or HH:MM:SS) to seconds
 * @param timeString - time string to parse
 * @returns number of seconds
 */
export const parseTime = (timeString: string): number => {
    const parts = timeString.split(":").map(Number);

    if (parts.length === 2) {
        // MM:SS
        return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
        // HH:MM:SS
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    return 0;
};
