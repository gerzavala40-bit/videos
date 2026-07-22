export class Helpers {
    timeline;
    constructor(timeline) {
        this.timeline = timeline;
    }
    get_effect(id) {
        return this.timeline.effects.find(effect => effect.id === id);
    }
    get_effects() {
        return this.timeline.effects;
    }
}
//# sourceMappingURL=helpers.js.map