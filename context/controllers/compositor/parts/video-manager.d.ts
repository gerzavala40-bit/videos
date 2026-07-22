import { Compositor } from "../controller.js";
import { Actions } from "../../../actions.js";
import { VideoEffect, State } from "../../../types.js";
import { Video } from "../../../../components/omni-media/types.js";
export declare class VideoManager extends Map<string, {
    sprite: PIXI.Sprite;
    transformer: PIXI.Container;
}> {
    #private;
    private compositor;
    private actions;
    constructor(compositor: Compositor, actions: Actions);
    create_and_add_video_effect(video: Video, state: State): void;
    add_video_effect(effect: VideoEffect, file: File, recreate?: boolean): void;
    add_video_to_canvas(effect: VideoEffect): void;
    remove_video_from_canvas(effect: VideoEffect): void;
    reset(effect: VideoEffect): void;
    draw_decoded_frame(effect: VideoEffect, frame: VideoFrame): void;
    pause_videos(): void;
    play_videos(): Promise<void>;
    pause_video(effect: VideoEffect): void;
    play_video(effect: VideoEffect): Promise<void>;
}
