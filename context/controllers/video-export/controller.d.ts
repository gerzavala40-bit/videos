import { Actions } from "../../actions.js";
import { Media } from "../media/controller.js";
import { AnyEffect, State } from "../../types.js";
import { Compositor } from "../compositor/controller.js";
export declare class VideoExport {
    #private;
    private actions;
    private compositor;
    on_timestamp_change: import("@benev/slate").Pub<number>;
    constructor(actions: Actions, compositor: Compositor, media: Media);
    save_file(): Promise<void>;
    resetExporter(state: State): void;
    export_start(state: State, bitrate: number): void;
    get_effect_current_time_relative_to_timecode(effect: AnyEffect, timecode: number): number;
}
