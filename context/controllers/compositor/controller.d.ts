import { Actions } from "../../actions.js";
import { Media } from "../media/controller.js";
import { TextManager } from "./parts/text-manager.js";
import { ImageManager } from "./parts/image-manager.js";
import { AudioManager } from "./parts/audio-manager.js";
import { VideoManager } from "./parts/video-manager.js";
import { FiltersManager } from "./parts/filter-manager.js";
import { AlignGuidelines } from "./lib/aligning_guidelines.js";
import { AnimationManager } from "./parts/animation-manager.js";
import { TransitionManager } from "./parts/transition-manager.js";
import { AnyEffect, ImageEffect, State, TextEffect, VideoEffect } from "../../types.js";
export interface Managers {
    videoManager: VideoManager;
    textManager: TextManager;
    imageManager: ImageManager;
    audioManager: AudioManager;
    animationManager: AnimationManager;
    filtersManager: FiltersManager;
    transitionManager: TransitionManager;
}
export declare class Compositor {
    #private;
    private actions;
    on_playing: import("@benev/slate").Pub<unknown>;
    timecode: number;
    timebase: number;
    currently_played_effects: Map<string, AnyEffect>;
    app: import("../../pixi.mjs.js").Application<import("../../pixi.mjs.js").Renderer<HTMLCanvasElement>>;
    managers: Managers;
    guidelines: AlignGuidelines;
    constructor(actions: Actions);
    canvasElementDrag: {
        onDragStart: (e: PIXI.FederatedPointerEvent, sprite: PIXI.Container, transformer: PIXI.Container) => void;
        onDragEnd: () => void;
        onDragMove: (event: PIXI.FederatedPointerEvent) => void;
    };
    reset(): void;
    clear(omit?: boolean): void;
    compose_effects(effects: AnyEffect[], timecode: number, exporting?: boolean): void;
    get_effect_current_time_relative_to_timecode(effect: AnyEffect, timecode: number): number;
    get_effects_relative_to_timecode(effects: AnyEffect[], timecode: number): AnyEffect[];
    seek(timecode: number, redraw?: boolean): Promise<void>;
    getObject(effect: VideoEffect | ImageEffect | TextEffect): {
        sprite: import("../../pixi.mjs.js").Text;
        transformer: import("../../pixi.mjs.js").Container<import("../../pixi.mjs.js").ContainerChild>;
    } | {
        sprite: import("../../pixi.mjs.js").Sprite;
        transformer: import("../../pixi.mjs.js").Container<import("../../pixi.mjs.js").ContainerChild>;
    } | undefined;
    init_guidelines(): {
        guidelintRect: import("../../pixi.mjs.js").Sprite;
        guidelines: AlignGuidelines;
    };
    recreate(state: State, media: Media): Promise<void>;
    update_canvas_objects(state: State): void;
    set_canvas_resolution(width: number, height: number): void;
    set_timebase(value: number): void;
    get selectedElement(): {
        sprite: import("../../pixi.mjs.js").Text;
        transformer: import("../../pixi.mjs.js").Container<import("../../pixi.mjs.js").ContainerChild>;
    } | {
        sprite: import("../../pixi.mjs.js").Sprite;
        transformer: import("../../pixi.mjs.js").Container<import("../../pixi.mjs.js").ContainerChild>;
    } | null | undefined;
    setOrDiscardActiveObjectOnCanvas(selectedEffect: AnyEffect | undefined, state: State): void;
    set_video_playing: (playing: boolean) => void;
    toggle_video_playing: () => void;
}
