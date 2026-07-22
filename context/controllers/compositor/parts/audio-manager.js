import { generate_id } from "@benev/slate";
import { collaboration } from "../../../context.js";
import { isEffectMuted } from "../utils/is_effect_muted.js";
import { find_place_for_new_effect } from "../../timeline/utils/find_place_for_new_effect.js";
export class AudioManager extends Map {
    compositor;
    actions;
    constructor(compositor, actions) {
        super();
        this.compositor = compositor;
        this.actions = actions;
    }
    create_and_add_audio_effect(audio, state) {
        collaboration.broadcastMedia(audio);
        const duration = audio.element.duration * 1000;
        const adjusted_duration_to_timebase = Math.floor(duration / (1000 / state.timebase)) * (1000 / state.timebase);
        const effect = {
            id: generate_id(),
            kind: "audio",
            name: audio.file.name,
            file_hash: audio.hash,
            raw_duration: duration,
            duration: adjusted_duration_to_timebase,
            start_at_position: 0,
            start: 0,
            end: adjusted_duration_to_timebase,
            track: 2,
        };
        const { position, track } = find_place_for_new_effect(state.effects, state.tracks);
        effect.start_at_position = position;
        effect.track = track;
        this.add_audio_effect(effect, audio.file);
    }
    add_audio_effect(effect, file, recreate) {
        const audio = document.createElement("audio");
        const source = document.createElement("source");
        source.type = "audio/mp3";
        source.src = URL.createObjectURL(file);
        audio.append(source);
        this.set(effect.id, audio);
        if (recreate) {
            return;
        }
        this.actions.add_audio_effect(effect);
    }
    pause_audios() {
        for (const effect of this.compositor.currently_played_effects.values()) {
            if (effect.kind === "audio") {
                const element = this.get(effect.id);
                if (element)
                    element.pause();
            }
        }
    }
    async play_audios() {
        for (const effect of this.compositor.currently_played_effects.values()) {
            if (effect.kind === "audio") {
                const element = this.get(effect.id);
                if (element) {
                    const isMuted = isEffectMuted(effect);
                    element.muted = isMuted;
                    await element.play();
                }
            }
        }
    }
    pause_audio(effect) {
        const element = this.get(effect.id);
        if (element)
            element.pause();
    }
    async play_audio(effect) {
        const element = this.get(effect.id);
        if (element)
            await element.play();
    }
}
//# sourceMappingURL=audio-manager.js.map