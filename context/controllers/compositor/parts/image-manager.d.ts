import { Compositor } from "../controller.js";
import { Actions } from "../../../actions.js";
import { ImageEffect, State } from "../../../types.js";
import { Image } from "../../../../components/omni-media/types.js";
export declare class ImageManager extends Map<string, {
    sprite: PIXI.Sprite;
    transformer: PIXI.Container;
}> {
    private compositor;
    private actions;
    constructor(compositor: Compositor, actions: Actions);
    create_and_add_image_effect(image: Image, state: State): Promise<void>;
    add_image_effect(effect: ImageEffect, file: File, recreate?: boolean): Promise<void>;
    add_image_to_canvas(effect: ImageEffect): void;
    remove_image_from_canvas(effect: ImageEffect): void;
}
