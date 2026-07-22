import { AnyEffect } from "../../../types.js";
import { Actions } from "../../../actions.js";
import { Media } from "../../media/controller.js";
import { Compositor } from "../../compositor/controller.js";
export declare class Encoder {
    #private;
    private actions;
    private compositor;
    private media;
    encode_worker: Worker;
    file: Uint8Array | null;
    constructor(actions: Actions, compositor: Compositor, media: Media);
    reset(): void;
    export_process_end(effects: AnyEffect[], timebase: number): void;
    encode_composed_frame(canvas: HTMLCanvasElement, timestamp: number): void;
    configure([width, height]: number[], bitrate: number, timebase: number): void;
}
