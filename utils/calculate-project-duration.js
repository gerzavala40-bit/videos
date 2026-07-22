export function calculateProjectDuration(effects) {
    return Math.max(...effects.map(effect => effect.start_at_position + (effect.end - effect.start)));
}
//# sourceMappingURL=calculate-project-duration.js.map