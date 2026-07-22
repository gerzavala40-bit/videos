import { EffectPlacementUtilities } from "./effect-placement-utilities.js";
// EffectPlacementProposal: Calculates proposed positions for effects on the timeline
export class EffectPlacementProposal {
    #placementUtilities = new EffectPlacementUtilities();
    calculateProposedTimecode(effectTimecode, { grabbed, position }, state) {
        const effectsToConsider = this.#excludeGrabbedEffect(grabbed.effect.id, state.effects);
        const trackEffects = effectsToConsider.filter(effect => effect.track === effectTimecode.track);
        const effectBefore = this.#placementUtilities.getEffectsBefore(trackEffects, effectTimecode.timeline_start)[0];
        const effectAfter = this.#placementUtilities.getEffectsAfter(trackEffects, effectTimecode.timeline_start)[0];
        const grabbedEffectLength = effectTimecode.timeline_end - effectTimecode.timeline_start;
        let proposedStartPosition = effectTimecode.timeline_start;
        let shrinkedSize = null;
        let effectsToPushForward = null;
        if (effectBefore && effectAfter) {
            const spaceBetween = this.#placementUtilities.calculateSpaceBetween(effectBefore, effectAfter);
            if (spaceBetween < grabbedEffectLength && spaceBetween > 0) {
                shrinkedSize = spaceBetween;
            }
            else if (spaceBetween === 0) {
                effectsToPushForward = this.#placementUtilities.getEffectsAfter(trackEffects, effectTimecode.timeline_start);
            }
        }
        proposedStartPosition = this.#adjustStartPosition(effectBefore, effectAfter, proposedStartPosition, effectTimecode.timeline_end, grabbedEffectLength, effectsToPushForward, shrinkedSize);
        if (position.indicator?.type === "addTrack") {
            return {
                proposed_place: {
                    start_at_position: this.#placementUtilities.roundToNearestFrame(effectTimecode.timeline_start, state.timebase),
                    track: effectTimecode.track
                },
                duration: grabbed.effect.end - grabbed.effect.start,
                effects_to_push: []
            };
        }
        return {
            proposed_place: {
                start_at_position: this.#placementUtilities.roundToNearestFrame(proposedStartPosition, state.timebase),
                track: effectTimecode.track
            },
            duration: shrinkedSize,
            effects_to_push: effectsToPushForward
        };
    }
    #adjustStartPosition(effectBefore, effectAfter, startPosition, timelineEnd, grabbedEffectLength, pushEffectsForward, shrinkedSize) {
        if (effectBefore) {
            const distanceToBefore = this.#placementUtilities.calculateDistanceToBefore(effectBefore, startPosition);
            if (distanceToBefore < 0) {
                startPosition = effectBefore.start_at_position + (effectBefore.end - effectBefore.start);
            }
        }
        if (effectAfter) {
            const distanceToAfter = this.#placementUtilities.calculateDistanceToAfter(effectAfter, timelineEnd);
            if (distanceToAfter < 0) {
                startPosition = pushEffectsForward
                    ? effectAfter.start_at_position
                    : shrinkedSize
                        ? effectAfter.start_at_position - shrinkedSize
                        : effectAfter.start_at_position - grabbedEffectLength;
            }
        }
        return startPosition;
    }
    #excludeGrabbedEffect(grabbedEffectId, effects) {
        return effects.filter(effect => effect.id !== grabbedEffectId);
    }
}
//# sourceMappingURL=effect-placement-proposal.js.map