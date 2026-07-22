import { MP4File, MP4VideoTrack } from './mp4boxjs/mp4box.adapter.js';
export declare function getVideoInfo(file: File): Promise<MP4VideoTrack>;
export declare class MP4FileSink {
    #private;
    constructor(file: MP4File);
    write(chunk: ArrayBuffer): void;
    close(): void;
}
