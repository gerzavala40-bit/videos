import { At, Grabbed } from "../../../../types.js";
export interface EffectDrop {
    grabbed: Grabbed;
    position: At;
}
export interface EffectDrag {
    grabbed: Grabbed;
    position: At;
}
export declare class EffectDragHandler {
    #private;
    at: At | null;
    grabbed: null | Grabbed;
    onEffectDrag: import("@benev/slate").Pub<EffectDrag>;
    onDrop: import("@benev/slate").Pub<EffectDrop>;
    move(position: At): void;
    start(grabbed: Grabbed, at: At): void;
    drop(e: PointerEvent): void;
    end(): void;
}
