import { Compositor } from "../controller.js";
import { Actions } from "../../../actions.js";
import { AudioEffect, State } from "../../../types.js";
import { Audio } from "../../../../components/omni-media/types.js";
export declare class AudioManager extends Map<string, HTMLAudioElement> {
    private compositor;
    private actions;
    constructor(compositor: Compositor, actions: Actions);
    create_and_add_audio_effect(audio: Audio, state: State): void;
    add_audio_effect(effect: AudioEffect, file: File, recreate?: boolean): void;
    pause_audios(): void;
    play_audios(): Promise<void>;
    pause_audio(effect: AudioEffect): void;
    play_audio(effect: AudioEffect): Promise<void>;
}
