// EffectPlacementUtilities: Utility for calculations and sorting
export class EffectPlacementUtilities {
    getEffectsBefore(effects, timelineStart) {
        return effects.filter(effect => effect.start_at_position < timelineStart)
            .sort((a, b) => b.start_at_position - a.start_at_position);
    }
    getEffectsAfter(effects, timelineStart) {
        return effects.filter(effect => effect.start_at_position > timelineStart)
            .sort((a, b) => a.start_at_position - b.start_at_position);
    }
    calculateSpaceBetween(effectBefore, effectAfter) {
        return effectAfter.start_at_position - (effectBefore.start_at_position + (effectBefore.end - effectBefore.start));
    }
    calculateDistanceToAfter(effectAfter, timelineEnd) {
        return effectAfter.start_at_position - timelineEnd;
    }
    calculateDistanceToBefore(effectBefore, timelineStart) {
        return timelineStart - (effectBefore.start_at_position + (effectBefore.end - effectBefore.start));
    }
    roundToNearestFrame(position, timebase) {
        return Math.round(position / (1000 / timebase)) * (1000 / timebase);
    }
}
//# sourceMappingURL=effect-placement-utilities.js.map