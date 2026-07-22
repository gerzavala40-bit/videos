import { Actions } from "../../../actions.js";
import { Media } from "../../media/controller.js";
import { EffectDrop } from "./drag-related/effect-drag.js";
import { Compositor } from "../../compositor/controller.js";
import { AnyEffect, ProposedTimecode, State } from "../../../types.js";
export declare class EffectManager {
    #private;
    private actions;
    private compositor;
    private media;
    constructor(actions: Actions, compositor: Compositor, media: Media);
    setProposedTimecode({ grabbed, position }: EffectDrop, proposedTimecode: ProposedTimecode, state: State): void;
    removeEffect(state: State, effect: AnyEffect): void;
    splitEffectAtTimestamp(state: State): void;
    setSelectedEffect(effect: AnyEffect | undefined, state: State): void;
    copySelectedEffect(state: State): void;
    isEffectOverlapping(effect: AnyEffect, effects: AnyEffect[], track: number): boolean;
    pasteSelectedEffect(state: State): void;
    cutSelectedEffect(state: State): void;
}
