import "gl-transitions/gl-transitions.js";
import { Actions } from '../../../actions.js';
import { Compositor } from '../controller.js';
import { GLTransition } from "../../../global.js";
import { AnyEffect, ImageEffect, State, VideoEffect } from '../../../types.js';
export type TransitionAbleEffect = ImageEffect | VideoEffect;
export interface Transition {
    id: string;
    duration: number;
    incoming: TransitionAbleEffect;
    outgoing: TransitionAbleEffect;
    transition: GLTransition;
}
interface PropsToUpdate {
    duration: number;
}
export declare const transitions: GLTransition[];
export declare class TransitionManager {
    #private;
    private compositor;
    private actions;
    timeline: gsap.core.Timeline;
    selected: null | string;
    onChange: import("@benev/slate").Pub<unknown>;
    constructor(compositor: Compositor, actions: Actions);
    updateTimelineDuration(duration: number): void;
    clearTransitions(omit?: boolean): void;
    isSelected(name: string): boolean;
    selectTransition(transition: Transition, recreate?: boolean): {
        apply: (state: State) => Promise<void>;
    };
    refreshTransitions(): void;
    updateTransition(state: State, propsToUpdate?: PropsToUpdate): Promise<void>;
    update(transitionId: string): void;
    removeSelectedTransition(): void;
    removeTransition(id: string, recreate?: boolean): void;
    play(time: number): void;
    pause(): void;
    seek(time: number): void;
    getTransition(id: string | null): Transition | undefined;
    getTransitionByEffect(effect: AnyEffect): Transition | undefined;
    protected getAnimations(effect: AnyEffect): Transition[];
    getTransitionDuration(id: string | null): number | undefined;
    getTransitionDurationPerEffect(transition: Transition | undefined, effect: AnyEffect): {
        incoming: number;
        outgoing: number;
    };
    getTransitions(): {
        duration: number;
        id: string;
        incoming: TransitionAbleEffect;
        outgoing: TransitionAbleEffect;
        transition: GLTransition;
    }[];
    getTransitionByPair(outgoing: TransitionAbleEffect, incoming: TransitionAbleEffect): Transition | undefined;
    findTouchingClips(clips: AnyEffect[]): {
        outgoing: TransitionAbleEffect;
        incoming: TransitionAbleEffect;
        position: number;
    }[];
    removeTransitionFromNoLongerTouchingEffects(state: State): void;
}
export {};
