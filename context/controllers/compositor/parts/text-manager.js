import { generate_id, flat } from "@benev/slate";
import { omnislate } from "../../../context.js";
import { find_place_for_new_effect } from "../../timeline/utils/find_place_for_new_effect.js";
export class TextManager extends Map {
    compositor;
    actions;
    #selected = null;
    #setPermissionStatus = null;
    #permissionStatus = null;
    textDefaultStyles = flat.state(TextStylesValues);
    constructor(compositor, actions) {
        super();
        this.compositor = compositor;
        this.actions = actions;
    }
    create_and_add_text_effect(state) {
        const effect = {
            id: generate_id(),
            kind: "text",
            start_at_position: 0,
            duration: 5000,
            start: 0,
            end: 5000,
            track: 0,
            fontSize: 38,
            text: "Default text",
            fontStyle: "normal",
            fontFamily: "Arial",
            align: "center",
            fontVariant: "normal",
            fontWeight: "normal",
            fill: ["#FFFFFF"],
            fillGradientStops: [],
            fillGradientType: 0,
            stroke: "#FFFFFF",
            strokeThickness: 0,
            lineJoin: "miter",
            miterLimit: 10,
            textBaseline: "alphabetic",
            letterSpacing: 0,
            dropShadow: false,
            dropShadowDistance: 5,
            dropShadowAlpha: 1,
            dropShadowBlur: 0,
            dropShadowAngle: 0.5,
            dropShadowColor: "#FFFFFF",
            breakWords: false,
            wordWrap: false,
            lineHeight: 0,
            leading: 0,
            wordWrapWidth: 100,
            whiteSpace: "pre",
            rect: {
                position_on_canvas: { x: this.compositor.app.stage.width / 2, y: this.compositor.app.stage.height / 2 },
                pivot: {
                    x: 0,
                    y: 0
                },
                scaleX: 1,
                scaleY: 1,
                width: 100,
                height: 20,
                rotation: 0,
            }
        };
        const { position, track } = find_place_for_new_effect(state.effects, state.tracks);
        effect.start_at_position = position;
        effect.track = track;
        this.add_text_effect(effect);
        omnislate.context.controllers.timeline.set_selected_effect(effect, state);
    }
    add_text_effect(effect, recreate) {
        const { rect, ...props } = effect;
        const style = new PIXI.TextStyle({
            ...props,
            //@ts-ignore
            fill: props.fill,
        });
        const text = new PIXI.Text(props.text, style);
        text.eventMode = "static";
        text.cursor = "pointer";
        text.x = rect.position_on_canvas.x;
        text.y = rect.position_on_canvas.y;
        text.scale.set(rect.scaleX, rect.scaleY);
        text.rotation = rect.rotation;
        text.pivot.set(effect.rect.pivot.x, effect.rect.pivot.y);
        //@ts-ignore
        const transformer = new PIXI.Transformer({
            boxRotationEnabled: true,
            translateEnabled: false, // implemented my own translate which work with align guidelines
            group: [text],
            stage: this.compositor.app.stage,
            wireframeStyle: {
                thickness: 2,
                color: 0xff0000
            }
        });
        transformer.name = generate_id();
        transformer.ignoreAlign = true;
        //@ts-ignore
        text.ignoreAlign = false;
        text.on('pointerdown', (e) => {
            this.compositor.canvasElementDrag.onDragStart(e, text, transformer);
            this.compositor.app.stage.addChild(transformer);
        });
        text.effect = { ...effect };
        this.set(effect.id, { sprite: text, transformer });
        if (recreate) {
            return;
        }
        this.actions.add_text_effect(effect);
        //@ts-ignore
        text.updateText();
    }
    add_text_to_canvas(effect) {
        const text = this.get(effect.id);
        if (text) {
            this.compositor.app.stage.addChild(text.sprite);
            text.sprite.zIndex = omnislate.context.state.tracks.length - effect.track;
            text.transformer.zIndex = omnislate.context.state.tracks.length - effect.track;
        }
    }
    remove_text_from_canvas(effect) {
        const text = this.get(effect.id);
        if (text) {
            this.compositor.app.stage.removeChild(text.transformer);
            this.compositor.app.stage.removeChild(text.sprite);
        }
    }
    measure_text_width(effect) {
        // const text = this.get(effect.id)
        // return PIXI.TextMetrics.measureText(effect.content, text!.sprite.style).width
    }
    measure_text_height(effect) {
        // const text = this.get(effect.id)?.sprite
        // return PIXI.TextMetrics.measureText(effect.content, text!.style).height
    }
    set_font_variant = (event) => {
        if (this.#selected) {
            const variant = event.target.value;
            this.actions.set_font_variant(this.#selected, variant);
            const text = this.get(this.#selected.id)?.sprite;
            text.style.fontVariant = variant;
        }
    };
    set_font_weight = (event) => {
        if (this.#selected) {
            const weight = event.target.value;
            this.actions.set_font_weight(this.#selected, weight);
            const text = this.get(this.#selected.id)?.sprite;
            text.style.fontWeight = weight;
        }
    };
    set_text_font = (event) => {
        if (this.#selected) {
            const font = event.target.value.replace(/-/g, ' ');
            this.actions.set_text_font(this.#selected, font);
            const text = this.get(this.#selected.id)?.sprite;
            text.style.fontFamily = font;
        }
    };
    set_font_size = (event) => {
        if (this.#selected) {
            const size = +event.target.value;
            this.actions.set_font_size(this.#selected, size);
            const text = this.get(this.#selected.id)?.sprite;
            text.style.fontSize = size;
            // this.#update_text_rect()
        }
    };
    set_font_style = (event) => {
        if (this.#selected) {
            const style = event.target.value;
            this.actions.set_font_style(this.#selected, style);
            const text = this.get(this.#selected.id)?.sprite;
            text.style.fontStyle = style;
        }
    };
    set_text_align = (event) => {
        if (this.#selected) {
            const align = event.target.value;
            this.actions.set_font_align(this.#selected, align);
            const text = this.get(this.#selected.id)?.sprite;
            text.style.align = align;
        }
    };
    set_fill = (event, index) => {
        if (this.#selected) {
            const color = event.target.value;
            this.actions.set_text_fill(this.#selected, color, index);
            const text = this.get(this.#selected.id)?.sprite;
            if (text.style.fill instanceof Array) {
                //@ts-ignore
                text.style.fill[index] = color;
                //@ts-ignore
                text.updateText();
            }
            else {
                text.style.fill = color;
                //@ts-ignore
                text.updateText();
            }
            this.textDefaultStyles.fill[index] = color;
        }
    };
    set_drop_shadow_color = (event) => {
        if (this.#selected) {
            const text = this.get(this.#selected.id)?.sprite;
            const value = event.target.value;
            this.actions.set_drop_shadow_color(this.#selected, value);
            //@ts-ignore
            text.style.dropShadowColor = value;
            //@ts-ignore
            text.updateText();
        }
    };
    set_drop_shadow_alpha = (event) => {
        if (this.#selected) {
            const value = +event.target.value;
            this.actions.set_drop_shadow_alpha(this.#selected, value);
            const text = this.get(this.#selected.id)?.sprite;
            //@ts-ignore
            text.style.dropShadowAlpha = value;
            //@ts-ignore
            text.updateText();
        }
    };
    set_drop_shadow_angle = (event) => {
        if (this.#selected) {
            const value = +event.target.value;
            this.actions.set_drop_shadow_angle(this.#selected, value);
            const text = this.get(this.#selected.id)?.sprite;
            //@ts-ignore
            text.style.dropShadowAngle = value;
            //@ts-ignore
            text.updateText();
        }
    };
    set_drop_shadow_blur = (event) => {
        if (this.#selected) {
            const value = +event.target.value;
            this.actions.set_drop_shadow_blur(this.#selected, value);
            const text = this.get(this.#selected.id)?.sprite;
            //@ts-ignore
            text.style.dropShadowBlur = value;
            //@ts-ignore
            text.updateText();
        }
    };
    set_drop_shadow_distance = (event) => {
        if (this.#selected) {
            const value = +event.target.value;
            this.actions.set_drop_shadow_distance(this.#selected, value);
            const text = this.get(this.#selected.id)?.sprite;
            //@ts-ignore
            text.style.dropShadowDistance = value;
            //@ts-ignore
            text.updateText();
        }
    };
    toggle_drop_shadow = (event) => {
        if (this.#selected) {
            const value = event.target.checked;
            const text = this.get(this.#selected.id)?.sprite;
            text.style.dropShadow = value;
            this.actions.toggle_drop_shadow(this.#selected, value);
            //@ts-ignore
            text.updateText();
        }
    };
    set_word_wrap = (event) => {
        if (this.#selected) {
            const value = event.target.checked;
            const text = this.get(this.#selected.id)?.sprite;
            this.actions.set_word_wrap(this.#selected, value);
            text.style.wordWrap = value;
            //@ts-ignore
            text.updateText();
        }
    };
    set_break_words = (event) => {
        if (this.#selected) {
            const value = event.target.checked;
            const text = this.get(this.#selected.id)?.sprite;
            this.actions.set_break_words(this.#selected, value);
            text.style.breakWords = value;
            //@ts-ignore
            text.updateText();
        }
    };
    set_leading = (event) => {
        if (this.#selected) {
            const value = +event.target.value;
            const text = this.get(this.#selected.id)?.sprite;
            this.actions.set_leading(this.#selected, value);
            text.style.leading = value;
            //@ts-ignore
            text.updateText();
        }
    };
    set_line_height = (event) => {
        if (this.#selected) {
            const value = +event.target.value;
            const text = this.get(this.#selected.id)?.sprite;
            this.actions.set_line_height(this.#selected, value);
            text.style.lineHeight = value;
            //@ts-ignore
            text.updateText();
        }
    };
    set_wrap_width = (event) => {
        if (this.#selected) {
            const value = +event.target.value;
            const text = this.get(this.#selected.id)?.sprite;
            this.actions.set_wrap_width(this.#selected, value);
            text.style.wordWrapWidth = value;
            //@ts-ignore
            text.updateText();
        }
    };
    set_white_space = (event) => {
        if (this.#selected) {
            const value = event.target.value;
            const text = this.get(this.#selected.id)?.sprite;
            this.actions.set_white_space(this.#selected, value);
            text.style.whiteSpace = value;
            //@ts-ignore
            text.updateText();
        }
    };
    move_fill_down(index) {
        if (this.#selected) {
            const text = this.get(this.#selected.id)?.sprite;
            if (text.style.fill instanceof Array) {
                if (index >= text.style.fill.length - 1) {
                    return;
                }
                this.actions.move_text_fill_down(this.#selected, index);
                [text.style.fill[index], text.style.fill[index + 1]] = [text.style.fill[index + 1], text.style.fill[index]];
                [this.textDefaultStyles.fill[index], this.textDefaultStyles.fill[index + 1]] = [this.textDefaultStyles.fill[index + 1], this.textDefaultStyles.fill[index]];
                //@ts-ignore
                text.updateText();
            }
        }
    }
    move_fill_up(index) {
        if (this.#selected) {
            const text = this.get(this.#selected.id)?.sprite;
            if (index <= 0)
                return;
            if (text.style.fill instanceof Array) {
                this.actions.move_text_fill_up(this.#selected, index);
                [text.style.fill[index - 1], text.style.fill[index]] = [text.style.fill[index], text.style.fill[index - 1]];
                [this.textDefaultStyles.fill[index - 1], this.textDefaultStyles.fill[index]] = [this.textDefaultStyles.fill[index], this.textDefaultStyles.fill[index - 1]];
                //@ts-ignore
                text.updateText();
            }
        }
    }
    set_text_content = (event) => {
        if (this.#selected) {
            const content = event.target.value;
            this.actions.set_text_content(this.#selected, content);
            const text = this.get(this.#selected.id)?.sprite;
            text.text = content;
            this.#update_text_rect();
        }
    };
    set_fill_gradient_type = (event) => {
        if (this.#selected) {
            const type = +event.target.value;
            this.actions.set_fill_gradient_type(this.#selected, type);
            const text = this.get(this.#selected.id)?.sprite;
            //@ts-ignore
            text.style.fillGradientType = type;
        }
    };
    add_fill_gradient_stop = () => {
        if (this.#selected) {
            this.actions.add_fill_gradient_stop(this.#selected);
            const text = this.get(this.#selected.id)?.sprite;
            //@ts-ignore
            text.style.fillGradientStops.push(0);
            this.textDefaultStyles.fillGradientStops.push(0);
            //@ts-ignore
            text.updateText();
        }
    };
    remove_fill_gradient_stop = (index) => {
        if (this.#selected) {
            this.actions.remove_fill_gradient_stop(this.#selected, index);
            const text = this.get(this.#selected.id)?.sprite;
            //@ts-ignore
            text.style.fillGradientStops = text.style.fillGradientStops.filter((_, i) => i !== index);
            this.textDefaultStyles.fillGradientStops = this.textDefaultStyles.fillGradientStops.filter((_, i) => i !== index);
            //@ts-ignore
            text.updateText();
        }
    };
    set_fill_gradient_stop = (event, index) => {
        if (this.#selected) {
            const value = +event.target.value;
            this.actions.set_fill_gradient_stop(this.#selected, index, value);
            const text = this.get(this.#selected.id)?.sprite;
            //@ts-ignore
            text.style.fillGradientStops[index] = value;
            this.textDefaultStyles.fillGradientStops[index] = value;
            //@ts-ignore
            text.updateText();
        }
    };
    add_fill = () => {
        if (this.#selected) {
            this.actions.add_text_fill(this.#selected);
            const text = this.get(this.#selected.id)?.sprite;
            if (text.style.fill instanceof Array) {
                //@ts-ignore
                text.style.fill = [...text.style.fill, "#FFFFFF"];
            }
            else {
                //@ts-ignore
                text.style.fill = [text.style.fill, "#FFFFFF"];
            }
            this.textDefaultStyles.fill.push("#FFFFFF");
        }
    };
    remove_fill = (index) => {
        if (this.#selected) {
            this.actions.remove_text_fill(this.#selected, index);
            const text = this.get(this.#selected.id)?.sprite;
            //@ts-ignore
            text.style.fill = text.style.fill.filter((_, i) => i !== index);
            this.textDefaultStyles.fill = this.textDefaultStyles.fill.filter((_, i) => i !== index);
        }
    };
    set_stroke_color = (event) => {
        if (this.#selected) {
            const text = this.get(this.#selected.id)?.sprite;
            const value = event.target.value;
            text.style.stroke = value;
            this.actions.set_stroke_color(this.#selected, value);
        }
    };
    set_stroke_thickness = (event) => {
        if (this.#selected) {
            const text = this.get(this.#selected.id)?.sprite;
            const value = +event.target.value;
            //@ts-ignore
            text.style.strokeThickness = value;
            this.actions.set_stroke_thickness(this.#selected, value);
        }
    };
    set_stroke_line_join = (event) => {
        if (this.#selected) {
            const text = this.get(this.#selected.id)?.sprite;
            const value = event.target.value;
            //@ts-ignore
            text.style.lineJoin = value;
            this.actions.set_stroke_line_join(this.#selected, value);
        }
    };
    set_stroke_miter_limit = (event) => {
        if (this.#selected) {
            const text = this.get(this.#selected.id)?.sprite;
            const value = +event.target.value;
            //@ts-ignore
            text.style.miterLimit = value;
            this.actions.set_stroke_miter_limit(this.#selected, value);
        }
    };
    set_letter_spacing = (event) => {
        if (this.#selected) {
            const text = this.get(this.#selected.id)?.sprite;
            const value = +event.target.value;
            text.style.letterSpacing = value;
            this.actions.set_letter_spacing(this.#selected, value);
        }
    };
    set_text_baseline = (event) => {
        if (this.#selected) {
            const text = this.get(this.#selected.id)?.sprite;
            const value = event.target.value;
            text.style.textBaseline = value;
            this.actions.set_text_baseline(this.#selected, value);
        }
    };
    set_selected_effect(effect) {
        if (effect) {
            this.#selected = { ...effect };
        }
        else
            this.#selected = null;
    }
    get selectedText() {
        return this.#selected;
    }
    #update_text_rect() {
        // if(this.#selected) {
        // 	const width = this.measure_text_width(this.#selected)
        // 	const height = this.measure_text_height(this.#selected)
        // 	const rect = {
        // 		...this.#selected!.rect,
        // 		width,
        // 		height
        // 	}
        // 	this.#selected.rect = rect
        // 	this.actions.set_text_rect(this.#selected!, {...rect})
        // }
    }
    destroy() {
        if (this.#setPermissionStatus) {
            this.#permissionStatus?.removeEventListener("change", this.#setPermissionStatus);
        }
    }
    async getFonts(onPermissionStateChange) {
        //@ts-ignore
        const permissionStatus = this.#permissionStatus = await navigator.permissions.query({ name: 'local-fonts' });
        const deniedStateText = "To enable local fonts, go to browser settings > site permissions, and allow fonts for this site.";
        const setStatus = this.#setPermissionStatus = async () => {
            if (permissionStatus.state === "granted") {
                const fonts = await window.queryLocalFonts();
                onPermissionStateChange(permissionStatus.state, "", fonts);
            }
            else if (permissionStatus.state === "denied") {
                onPermissionStateChange(permissionStatus.state, deniedStateText);
            }
        };
        return new Promise((resolve, reject) => {
            if ('permissions' in navigator && 'queryLocalFonts' in window) {
                async function checkFontAccess() {
                    try {
                        permissionStatus.addEventListener("change", setStatus);
                        if (permissionStatus.state === 'granted') {
                            const fonts = await window.queryLocalFonts();
                            resolve(fonts);
                        }
                        else if (permissionStatus.state === "prompt") {
                            reject("User needs to grant permission for local fonts.");
                        }
                        else if (permissionStatus.state === "denied") {
                            reject(deniedStateText);
                        }
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                checkFontAccess();
            }
            else {
                reject("Local Font Access API is not supported in this browser.");
            }
        });
    }
}
const TextStylesValues = {
    size: 26,
    variant: ["normal", "small-caps"],
    style: ["normal", "italic", "oblique"],
    weight: ["normal", "bold", "bolder", "lighter", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
    fill: ["#000000"],
    fillGradientType: 0,
    fillGradientStops: [],
    stroke: "#000000",
    strokeThickness: 0,
    lineJoin: ["miter", "round", "bevel"],
    miterLimit: 10,
    letterSpacing: 0,
    textBaseline: ["alphabetic", "bottom", "middle", "top", "hanging"],
    align: ["left", "right", "center", "justify"],
    whiteSpace: ["pre", "normal", "pre-line"],
    wrapWidth: 100,
    lineHeight: 0,
    leading: 0
};
//# sourceMappingURL=text-manager.js.map