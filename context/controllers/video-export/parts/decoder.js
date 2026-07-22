import { generate_id } from "@benev/slate";
import { demuxer } from "../../../../tools/demuxer.js";
import { sort_effects_by_track } from "../utils/sort_effects_by_track.js";
export class Decoder {
    actions;
    media;
    compositor;
    encoder;
    decoded_frames = new Map();
    decoded_effects = new Map();
    #workers = [];
    constructor(actions, media, compositor, encoder) {
        this.actions = actions;
        this.media = media;
        this.compositor = compositor;
        this.encoder = encoder;
    }
    reset() {
        this.decoded_frames.forEach(decoded => decoded.frame.close());
        this.decoded_frames.clear();
        this.decoded_effects.clear();
        this.#workers.forEach(worker => worker.terminate());
        this.#workers = [];
    }
    async get_and_draw_decoded_frame(effects, timestamp) {
        const effects_at_timestamp = this.compositor.get_effects_relative_to_timecode(effects, timestamp);
        for (const effect of sort_effects_by_track(effects_at_timestamp)) {
            if (effect.kind === "video") {
                const { frame, frame_id } = await this.#get_frame_from_video(effect, timestamp);
                this.compositor.managers.videoManager.draw_decoded_frame(effect, frame);
                frame.close();
                this.decoded_frames.delete(frame_id);
            }
        }
    }
    #get_frame_from_video(effect, timestamp) {
        if (!this.decoded_effects.has(effect.id)) {
            this.#extract_frames_from_video(effect, timestamp);
        }
        return new Promise((resolve) => {
            const decoded = this.#find_closest_effect_frame(effect);
            if (decoded) {
                resolve(decoded);
            }
            else {
                const interval = setInterval(() => {
                    const decoded = this.#find_closest_effect_frame(effect);
                    if (decoded) {
                        resolve(decoded);
                        clearInterval(interval);
                    }
                }, 100);
            }
        });
    }
    async #extract_frames_from_video(effect, timestamp) {
        this.actions.set_export_status("demuxing");
        const worker = new Worker(new URL("./decode_worker.js", import.meta.url), { type: "module" });
        this.#workers.push(worker);
        worker.addEventListener("message", (msg) => {
            if (msg.data.action === "new-frame") {
                const id = generate_id();
                this.decoded_frames.set(id, { ...msg.data.frame, frame_id: id });
            }
            if (msg.data.action === "end") {
                if (!this.compositor.currently_played_effects.get(effect.id)) {
                    worker.terminate();
                    Array.from(this.decoded_frames.values()).forEach(value => {
                        if (value.effect_id === effect.id) {
                            value.frame.close();
                            this.decoded_frames.delete(value.frame_id);
                        }
                    });
                }
            }
        });
        const transition = this.compositor.managers.transitionManager.getTransitionByEffect(effect);
        const { incoming, outgoing } = this.compositor.managers.transitionManager.getTransitionDurationPerEffect(transition, effect);
        const file = await this.media.get_file(effect.file_hash);
        worker.postMessage({
            action: "demux",
            props: {
                start: effect.start - incoming,
                end: effect.end === effect.duration ? effect.raw_duration : effect.end + outgoing,
                id: effect.id
            },
            starting_timestamp: timestamp,
            timebase: this.compositor.timebase
        });
        demuxer(file, this.encoder.encode_worker, (config) => worker.postMessage({ action: "configure", config }), (chunk) => worker.postMessage({ action: "chunk", chunk }), effect.start - incoming, effect.end === effect.duration ? effect.raw_duration : effect.end + outgoing);
        this.decoded_effects.set(effect.id, effect.id);
    }
    #find_closest_effect_frame(effect) {
        const frame = Array.from(this.decoded_frames.values()).filter(frame => frame.effect_id === effect.id).sort((a, b) => a.timestamp - b.timestamp)[0];
        if (frame) {
            return frame;
        }
    }
}
//# sourceMappingURL=decoder.js.map