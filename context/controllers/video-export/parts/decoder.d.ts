import { Encoder } from "./encoder.js";
import { Actions } from "../../../actions.js";
import { Media } from "../../media/controller.js";
import { Compositor } from "../../compositor/controller";
import { AnyEffect } from "../../../types.js";
interface DecodedFrame {
    frame: VideoFrame;
    effect_id: string;
    timestamp: number;
    frame_id: string;
}
export declare class Decoder {
    #private;
    private actions;
    private media;
    private compositor;
    private encoder;
    decoded_frames: Map<string, DecodedFrame>;
    decoded_effects: Map<string, string>;
    constructor(actions: Actions, media: Media, compositor: Compositor, encoder: Encoder);
    reset(): void;
    get_and_draw_decoded_frame(effects: AnyEffect[], timestamp: number): Promise<void>;
}
export {};
