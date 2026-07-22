import type { ReadChunkFunc } from 'mediainfo.js';
import { Video, VideoFile, AnyMedia, ImageFile, Image, AudioFile, Audio } from "../../../components/omni-media/types.js";
export declare function makeReadChunk(file: File): ReadChunkFunc;
export declare function getMediaInfo(): Promise<any>;
export declare class Media extends Map<string, AnyMedia> {
    #private;
    on_media_change: import("@benev/slate").Pub<{
        files: AnyMedia[];
        action: "removed" | "added" | "placeholder";
    }>;
    constructor();
    are_files_ready(): Promise<unknown>;
    get_file(file_hash: string): Promise<File | undefined>;
    getImportedFiles(): Promise<AnyMedia[]>;
    delete_file(hash: string): Promise<unknown>;
    getVideoFileMetadata(file: File): Promise<{
        fps: number;
        duration: number;
        frames: number;
        width: number | undefined;
        height: number | undefined;
    }>;
    syncFile(file: File, hash: string, proxy?: boolean, isHost?: boolean): Promise<void>;
    import_file(input: HTMLInputElement | File, proxyHash?: string, isProxy?: boolean): Promise<void>;
    create_video_thumbnail(video: HTMLVideoElement): Promise<string>;
    create_image_elements(files: ImageFile[]): Image[];
    create_audio_elements(files: AudioFile[]): Audio[];
    create_video_elements(files: VideoFile[]): Promise<Video[]>;
}
