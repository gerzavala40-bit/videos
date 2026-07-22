import { AnyEffect } from "../../../types.js";
export declare class EffectPlacementUtilities {
    getEffectsBefore(effects: AnyEffect[], timelineStart: number): AnyEffect[];
    getEffectsAfter(effects: AnyEffect[], timelineStart: number): AnyEffect[];
    calculateSpaceBetween(effectBefore: AnyEffect, effectAfter: AnyEffect): number;
    calculateDistanceToAfter(effectAfter: AnyEffect, timelineEnd: number): number;
    calculateDistanceToBefore(effectBefore: AnyEffect, timelineStart: number): number;
    roundToNearestFrame(position: number, timebase: number): number;
}
