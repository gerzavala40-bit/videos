export function get_effect_at_timestamp(effect, timestamp) {
    if (effect.start_at_position <= timestamp && timestamp <= effect.start_at_position + (effect.end - effect.start))
        return effect;
}
//# sourceMappingURL=get_effect_at_timestamp.js.map