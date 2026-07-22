import { Actions } from "../../../../actions.js";
import { AnyEffect, State } from "../../../../types.js";
export declare class effectTrimHandler {
    #private;
    private actions;
    initial_x: number;
    initial_start_position: number;
    initial_start: number;
    initial_end: number;
    side: "left" | "right" | null;
    effect: AnyEffect | null;
    dropped: boolean;
    grabbed: boolean;
    onDragOver: import("@benev/slate").Pub<{
        start_at_position: number;
        start: number;
        end: number;
        effectId: string;
    }>;
    onDrop: import("@benev/slate").Pub<{
        effectId: string;
    }>;
    constructor(actions: Actions);
    effect_dragover(clientX: number, state: State): void;
    trim_start: (e: PointerEvent, effect: AnyEffect, side: "left" | "right") => void;
    trim_end: (e: PointerEvent, state: State) => void;
    trim_drop: (e: PointerEvent, state: State) => void;
}
