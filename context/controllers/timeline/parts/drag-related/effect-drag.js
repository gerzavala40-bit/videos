import { pub } from "@benev/slate";
export class EffectDragHandler {
    at = null;
    grabbed = null;
    #isGrabbed = false;
    onEffectDrag = pub();
    onDrop = pub();
    move(position) {
        if (this.#isGrabbed && this.grabbed) {
            this.onEffectDrag.publish({ position, grabbed: this.grabbed });
            this.at = position;
        }
    }
    start(grabbed, at) {
        this.#isGrabbed = true;
        this.grabbed = grabbed;
        this.at = at;
    }
    drop(e) {
        if (this.grabbed) {
            const path = e.composedPath();
            const indicator = path.find(e => e.className === "indicator-area");
            this.onDrop.publish({ grabbed: this.grabbed, position: { ...this.at,
                    indicator: indicator
                        ? { type: "addTrack", index: Number(indicator.getAttribute("data-index")) }
                        : null } });
            this.#resetState();
        }
    }
    end() {
        if (this.grabbed) {
            this.onDrop.publish({ grabbed: this.grabbed, position: this.at });
            this.#resetState();
        }
    }
    #resetState() {
        this.grabbed = null;
        this.#isGrabbed = false;
        this.at = null;
    }
}
//# sourceMappingURL=effect-drag.js.map