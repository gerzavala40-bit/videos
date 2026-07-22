import { Compositor } from "../controller.js";
import { Actions } from "../../../actions.js";
import { AnyEffect, ImageEffect, State, VideoEffect } from "../../../types.js";
interface AnimationBase<T = AnimationIn | AnimationOut> {
    targetEffect: VideoEffect | ImageEffect;
    name: T;
    type: "in" | "out";
    duration: number;
    for: AnimationFor;
}
export declare const animationNone: "none";
export declare const animationIn: readonly ["slide-in", "fade-in", "spin-in", "bounce-in", "wipe-in", "blur-in", "zoom-in"];
export declare const animationOut: readonly ["slide-out", "fade-out", "spin-out", "bounce-out", "wipe-out", "blur-out", "zoom-out"];
export type AnimationIn = AnimationBase<(typeof animationIn)[number]>;
export type AnimationOut = AnimationBase<(typeof animationOut)[number]>;
export type AnimationNone = AnimationBase<(typeof animationNone)[number]>;
export type Animation = AnimationIn | AnimationOut;
export type UpdatedProps = {
    effect: ImageEffect | VideoEffect;
    duration: number;
    kind?: "in" | "out";
};
export type AnimationFor = "Animation" | "Transition";
export declare class AnimationManager {
    #private;
    private compositor;
    protected actions: Actions;
    protected animationFor: AnimationFor;
    timeline: gsap.core.Timeline;
    onChange: import("@benev/slate").Pub<unknown>;
    constructor(compositor: Compositor, actions: Actions, animationFor: AnimationFor);
    clearAnimations(omit?: boolean): void;
    get animations(): Animation[];
    set animations(animations: Animation[]);
    protected getAnimations(effect: AnyEffect): Animation[];
    protected getAnimation(effect: AnyEffect, kind: "in" | "out"): Animation | undefined;
    protected getAnyAnimation(effect: AnyEffect): Animation | undefined;
    selectedAnimationForEffect(effect: AnyEffect | null, animation: Animation): boolean | undefined;
    isAnyAnimationInSelected(effect: AnyEffect | null): boolean;
    isAnyAnimationOutSelected(effect: AnyEffect | null): boolean;
    updateTimelineDuration(duration: number): void;
    updateAnimation(updatedProps: UpdatedProps): void;
    refresh(state: State): Promise<void>;
    getAnimationDuration(effect: AnyEffect, kind: "in" | "out"): number | undefined;
    selectAnimation(effect: ImageEffect | VideoEffect, animation: Animation, state: State, recreate?: boolean, omit?: boolean): Promise<void>;
    play(time: number): void;
    pause(): void;
    seek(time: number): void;
    updateAnimationTimelineDuration(duration: number): void;
    removeAnimations(effect: AnyEffect): void;
    removeAnimation(state: State, effect: ImageEffect | VideoEffect, type: "in" | "out", refresh?: boolean, omit?: boolean): void;
    deselectAnimation(effect: ImageEffect | VideoEffect, type: "in" | "out", refresh?: boolean, omit?: boolean): Promise<unknown>;
}
export {};
