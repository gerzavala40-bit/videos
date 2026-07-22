import { Actions } from "../../actions.js";
import { Media } from "../media/controller.js";
import { Compositor } from "../compositor/controller.js";
import { PlayheadDrag } from "./parts/drag-related/playhead-drag.js";
import { effectTrimHandler } from "./parts/drag-related/effect-trim.js";
import { ProposedTimecode, AnyEffect, EffectTimecode, State } from "../../types.js";
import { EffectDrag, EffectDragHandler, EffectDrop } from "./parts/drag-related/effect-drag.js";
/**
    * The Timeline class orchestrates the main actions for the video editor’s timeline.
    * It utilizes specialized classes to handle effect-specific logic and drag actions,
    * and interacts with the compositor to ensure timeline changes are reflected on the canvas,
    * serving as the primary controller for timeline management.
*/
export declare class Timeline {
    #private;
    private actions;
    private media;
    private compositor;
    effectTrimHandler: effectTrimHandler;
    effectDragHandler: EffectDragHandler;
    playheadDragHandler: PlayheadDrag;
    constructor(actions: Actions, media: Media, compositor: Compositor);
    /**
        * Calculates a proposed timecode for an effect's placement, considering overlaps
        * and positioning on the timeline.
        *
        * @param effectTimecode - The start and end time of the effect to place.
        * @param grabbed_effect_id - The ID of the effect currently being dragged.
        * @param state - The current application state.
        * @returns A ProposedTimecode object containing the suggested placement and any adjustments.
    */
    calculate_proposed_timecode(effectTimecode: EffectTimecode, drag: EffectDrag, state: State): ProposedTimecode;
    /**
        * Sets the proposed timecode for an effect based on the calculated proposal, adjusting
        * the effect’s start position, track, and duration if needed.
        *
        * @param effect - The effect to update with a new timecode.
        * @param proposedTimecode - The calculated timecode proposal for placement.
    */
    set_proposed_timecode(dragProps: EffectDrop, proposedTimecode: ProposedTimecode, state: State): void;
    /**
        * Removes the currently selected effect from the application state, both
        * compositor and timeline will reflect this removal
        *
        * @param state - The current application state, which includes the selected effect.
    */
    remove_selected_effect(state: State): void;
    /**
        * Sets the selected effect in the application state, allowing both the timeline
        * and the compositor canvas to reflect the selection.
        *
        * @param effect - The effect to set as selected, or undefined to clear the selection.
        * @param state - The current application state, where the selected effect will be updated.
    */
    set_selected_effect(effect: AnyEffect | undefined, state: State): void;
    /**
        * Splits the selected effect or, if none is selected, splits the first effect found
        * at the current timestamp. The original effect is updated, and a new effect is created
        * at the split point.
        *
        * @param state - The current application state.
    */
    split(state: State): void;
    copy(state: State): void;
    paste(state: State): void;
    cut(state: State): void;
}
