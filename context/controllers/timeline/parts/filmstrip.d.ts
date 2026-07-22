import { GoldElement } from "@benev/slate";
import { VideoEffect } from "../../../types.js";
import { Media } from "../../media/controller.js";
import { FFmpegHelper } from "../../video-export/helpers/FFmpegHelper/helper.js";
export declare class Filmstrip {
    #private;
    private effect;
    private media;
    private ffmpeg;
    frames_count: number;
    effect_last_offset_left_position: number;
    constructor(effect: VideoEffect, media: Media, ffmpeg: FFmpegHelper);
    on_file_found(): Promise<void>;
    dispose(): void;
    get effect_width(): number;
    recalculate_all_visible_filmstrip_frames(effect: VideoEffect, timeline: GoldElement, zoom: number, force_recalculate?: boolean): AsyncGenerator<{
        url: string;
        normalized_left: number;
        i: number;
    }>;
}
