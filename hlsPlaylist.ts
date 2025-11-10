export class HlsPlaylist {
    private m3u8: string;

    constructor(targetDuration: number = 2) {
        this.m3u8 = '';

        this.m3u8 += '#EXTM3U\n';
        this.m3u8 += '#EXT-X-PLAYLIST-TYPE:EVENT\n';
        this.m3u8 += `#EXT-X-TARGETDURATION:${targetDuration}\n`;
        this.m3u8 += '#EXT-X-VERSION:4\n';
        this.m3u8 += '#EXT-X-MEDIA-SEQUENCE:0\n';
        this.m3u8 += '#EXT-X-INDEPENDENT-SEGMENTS\n';
    }

    get(): string {
        return this.m3u8;
    }

    addSegmentFile(file: string, duration: number = 2): void {
        this.m3u8 += `#EXTINF:${duration},\n`;
        this.m3u8 += '#EXT-X-DISCONTINUITY\n';
        this.m3u8 += `${file}\n`;
    }

    addEndMarker(): void {
        this.m3u8 += '#EXT-X-ENDLIST\n';
    }
}