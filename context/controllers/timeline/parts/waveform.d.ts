import { Media } from '../../media/controller.js';
import { AudioEffect, State } from '../../../types.js';
export declare class Waveform {
    #private;
    private effect;
    private media;
    wave: HTMLDivElement;
    constructor(effect: AudioEffect, media: Media, state: State);
    on_file_found(state: State): Promise<void>;
    update_waveform(state: State): void;
    dispose(): void;
}
