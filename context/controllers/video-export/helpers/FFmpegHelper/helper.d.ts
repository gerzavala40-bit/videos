import { FFprobeWorker } from "ffprobe-wasm/browser.mjs";
import { FFmpeg } from "@ffmpeg/ffmpeg/dist/esm/index.js";
import { Actions } from "../../../../actions.js";
import { Media } from "../../../media/controller.js";
import { AnyEffect } from "../../../../types.js";
export declare class FFmpegHelper {
    #private;
    ffmpeg: FFmpeg;
    ffprobe: FFprobeWorker;
    is_loading: import("@benev/slate").OpSignal<any>;
    isLoading: Promise<any>;
    constructor(actions: Actions);
    write_composed_data(binary: Uint8Array, container_name: string): Promise<void>;
    merge_audio_with_video_and_mux(effects: AnyEffect[], video_container_name: string, output_file_name: string, media: Media, timebase: number): Promise<void>;
    get_muxed_file(name: string): Promise<Uint8Array>;
    get_frames_count(file: File): Promise<number>;
}
