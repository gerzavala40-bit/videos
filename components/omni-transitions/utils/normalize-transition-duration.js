export function normalizeTransitionDuration(sliderValue, timebaseFrame) {
    let normalized = Math.round(sliderValue / timebaseFrame) * timebaseFrame;
    while ((normalized / 2) % timebaseFrame !== 0) {
        normalized += timebaseFrame;
    }
    return normalized;
}
//# sourceMappingURL=normalize-transition-duration.js.map