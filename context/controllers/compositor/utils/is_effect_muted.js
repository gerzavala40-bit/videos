import { omnislate } from "../../../context.js";
export function isEffectMuted(effect) {
    const track = omnislate.context.state.tracks[effect.track];
    return track?.muted ?? false;
}
//# sourceMappingURL=is_effect_muted.js.map