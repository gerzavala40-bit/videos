import { generate_id } from "@benev/slate/x/tools/generate_id.js";
import { Helpers } from "./helpers.js";
import { collaboration } from "./context.js";
import { withBroadcast } from "../utils/with-broadcast.js";
import { actionize_historical, actionize_non_historical } from "./../utils/actionize.js";
export const non_historical = actionize_non_historical({
    clear_project: state => () => { },
    set_incoming_non_historical_state_webrtc: state => (historical) => {
        for (const k in state) {
            const key = k;
            //@ts-ignore
            state[key] = historical[key];
        }
    },
    set_standard: state => (standard) => {
        state.settings.standard = standard;
    },
    set_aspect_ratio: state => (aspectRatio) => {
        state.settings.aspectRatio = aspectRatio;
    },
    set_bitrate: state => (value) => {
        state.settings.bitrate = value;
    },
    zoom_in: state => () => {
        state.zoom += 0.1;
    },
    zoom_out: state => () => {
        state.zoom -= 0.1;
    },
    set_timecode: state => (timecode) => {
        state.timecode = timecode;
    },
    increase_timecode: state => (by_milliseconds) => {
        state.timecode += by_milliseconds;
    },
    set_is_playing: state => (is_playing) => {
        state.is_playing = is_playing;
    },
    toggle_is_playing: state => () => {
        state.is_playing = !state.is_playing;
    },
    set_is_exporting: state => (is_exporting) => {
        state.is_exporting = is_exporting;
    },
    set_export_progress: state => (progress) => {
        state.export_progress = progress;
    },
    set_timebase: state => (timebase) => {
        state.timebase = timebase;
    },
    set_export_status: state => (status) => {
        state.export_status = status;
    },
    set_fps: state => (fps) => {
        state.fps = fps;
    },
    set_log: state => (log) => {
        state.log = log;
    },
    set_selected_effect: state => (effect) => {
        state.selected_effect = effect;
    },
    set_project_resolution: state => (width, height) => {
        state.settings = {
            ...state.settings,
            width,
            height
        };
    },
    update_transition: state => (transitionId) => {
        // empty action for collaboration to trigger transition update
    }
});
export const historical = actionize_historical({
    toggle_track_muted: state => (trackId) => {
        const track = state.tracks.find(track => track.id === trackId);
        if (track) {
            track.muted = !track.muted;
        }
    },
    toggle_track_visibility: state => (trackId) => {
        const track = state.tracks.find(track => track.id === trackId);
        if (track) {
            track.visible = !track.visible;
        }
    },
    toggle_track_locked: state => (trackId) => {
        const track = state.tracks.find(track => track.id === trackId);
        if (track) {
            track.locked = !track.locked;
        }
    },
    add_transition: state => (transition) => {
        state.transitions.push(transition);
    },
    remove_transition: state => (id) => {
        state.transitions = state.transitions.filter(t => t.id !== id);
    },
    set_transition_duration: state => (duration, transitionId) => {
        const effect = state.transitions.find(t => t.id === transitionId);
        if (effect)
            effect.duration = duration;
    },
    clear_transitions: state => () => {
        state.transitions = [];
    },
    clear_animations: state => () => {
        state.animations = [];
    },
    set_animation_duration: state => (duration, { id }) => {
        const effect = state.animations.find(a => a.targetEffect.id === id);
        if (effect)
            effect.duration = duration;
    },
    set_animations: state => (animations) => {
        state.animations = animations;
    },
    add_animation: state => (animation, animationFor) => {
        state.animations.push(animation);
    },
    remove_animation: state => (effect, type, animationFor) => {
        state.animations = state.animations.filter((animation) => !(animation.targetEffect.id === effect.id && animation.type === type && animation.for === animationFor));
    },
    remove_filter: state => (effect, type) => {
        state.filters = state.filters.filter(filter => !(filter.targetEffectId === effect.id && filter.type === type));
    },
    add_filter: state => (filter) => {
        state.filters.push(filter);
    },
    set_incoming_historical_state_webrtc: state => (historical) => {
        for (const k in state) {
            const key = k;
            //@ts-ignore
            state[key] = historical[key];
        }
    },
    set_project_id: state => (id) => {
        state.projectId = id;
    },
    set_effects: state => (effects) => {
        state.effects = effects;
    },
    set_project_name: state => (value) => {
        state.projectName = value;
    },
    add_text_effect: state => (effect) => {
        state.effects.push(effect);
    },
    add_image_effect: state => (effect) => {
        state.effects.push(effect);
    },
    add_video_effect: state => (effect) => {
        state.effects.push(effect);
    },
    add_audio_effect: state => (effect) => {
        state.effects.push(effect);
    },
    set_pivot: state => ({ id }, x, y) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.rect.pivot = { x, y };
    },
    set_text_fill: state => ({ id }, color, index) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fill[index] = color;
    },
    move_text_fill_up: state => ({ id }, index) => {
        const effect = state.effects.find(effect => effect.id === id);
        [effect.fill[index - 1], effect.fill[index]] = [effect.fill[index], effect.fill[index - 1]];
    },
    move_text_fill_down: state => ({ id }, index) => {
        const effect = state.effects.find(effect => effect.id === id);
        [effect.fill[index], effect.fill[index + 1]] = [effect.fill[index + 1], effect.fill[index]];
    },
    set_text_font: state => ({ id }, font) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fontFamily = font;
    },
    set_font_size: state => ({ id }, size) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fontSize = size;
    },
    set_font_style: state => ({ id }, style) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fontStyle = style;
    },
    set_font_align: state => ({ id }, align) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.align = align;
    },
    set_font_variant: state => ({ id }, variant) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fontVariant = variant;
    },
    set_font_weight: state => ({ id }, weight) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fontWeight = weight;
    },
    set_fill_gradient_type: state => ({ id }, type) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fillGradientType = type;
    },
    add_fill_gradient_stop: state => ({ id }) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fillGradientStops.push(0);
    },
    remove_fill_gradient_stop: state => ({ id }, index) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fillGradientStops = effect.fillGradientStops.filter((_, i) => i !== index);
    },
    set_fill_gradient_stop: state => ({ id }, index, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fillGradientStops[index] = value;
    },
    set_text_rect: state => ({ id }, rect) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.rect = rect;
    },
    set_text_content: state => ({ id }, content) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.text = content;
    },
    add_text_fill: state => ({ id }) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fill.push("#FFFFFF");
    },
    remove_text_fill: state => ({ id }, index) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.fill = effect.fill.filter((_, i) => i !== index);
    },
    set_stroke_color: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.stroke = value;
    },
    set_stroke_thickness: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.strokeThickness = value;
    },
    set_stroke_line_join: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.lineJoin = value;
    },
    set_stroke_miter_limit: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.miterLimit = value;
    },
    set_text_baseline: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.textBaseline = value;
    },
    set_letter_spacing: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.letterSpacing = value;
    },
    set_drop_shadow_distance: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.dropShadowDistance = value;
    },
    set_drop_shadow_blur: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.dropShadowBlur = value;
    },
    set_drop_shadow_alpha: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.dropShadowAlpha = value;
    },
    set_drop_shadow_angle: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.dropShadowAngle = value;
    },
    set_drop_shadow_color: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.dropShadowColor = value;
    },
    toggle_drop_shadow: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.dropShadow = value;
    },
    set_word_wrap: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.wordWrap = value;
    },
    set_break_words: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.breakWords = value;
    },
    set_wrap_width: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.wordWrapWidth = value;
    },
    set_leading: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.leading = value;
    },
    set_line_height: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.lineHeight = value;
    },
    set_white_space: state => ({ id }, value) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.whiteSpace = value;
    },
    set_effect_track: state => (effect, track) => {
        const helper = new Helpers(state);
        helper.get_effect(effect.id).track = track;
    },
    set_effect_duration: state => ({ id }, duration) => {
        const helper = new Helpers(state);
        const effect = helper.get_effect(id);
        effect.duration = duration;
        effect.end = effect.start + duration;
    },
    set_effect_start_position: state => ({ id }, x) => {
        const helper = new Helpers(state);
        const effect = helper.get_effect(id);
        effect.start_at_position = x;
    },
    set_effect_start: state => ({ id }, start) => {
        const helper = new Helpers(state);
        const effect = helper.get_effect(id);
        effect.start = start;
    },
    set_effect_end: state => ({ id }, end) => {
        const helper = new Helpers(state);
        const effect = helper.get_effect(id);
        effect.end = end;
    },
    add_track: state => () => {
        state.tracks.push({ id: generate_id(), muted: false, locked: false, visible: true });
    },
    remove_track: state => (id) => {
        const new_arr = state.tracks.filter(track => track.id !== id);
        state.tracks = new_arr;
    },
    remove_tracks: state => () => {
        state.tracks = [];
        state.tracks.push({ id: generate_id(), muted: false, locked: false, visible: true });
    },
    set_rotation: state => ({ id }, rotation) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.rect.rotation = rotation;
    },
    set_position_on_canvas: state => ({ id }, x, y) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.rect.position_on_canvas = { x, y };
    },
    set_effect_width: state => ({ id }, width) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.rect.width = width;
    },
    set_effect_height: state => ({ id }, height) => {
        const effect = state.effects.find(effect => effect.id === id);
        effect.rect.height = height;
    },
    remove_effect: state => ({ id }) => {
        const effects = state.effects.filter(effect => effect.id !== id);
        state.effects = effects;
    },
    set_effect_scale: state => (effect, scale) => {
        const eff = state.effects.find(({ id }) => effect.id === id);
        eff.rect.scaleX = scale.x;
        eff.rect.scaleY = scale.y;
    },
    remove_all_effects: state => () => {
        state.effects = [];
    }
});
// Wrapped actions
export const historical_actions = Object.entries(historical).reduce((acc, [key, action]) => {
    acc[key] = withBroadcast(action, (a, p) => {
        collaboration.broadcastAction(a, p);
    });
    return acc;
}, {});
export const non_historical_actions = Object.entries(non_historical).reduce((acc, [key, action]) => {
    acc[key] = withBroadcast(action, (a, p) => {
        collaboration.broadcastAction(a, p);
    });
    return acc;
}, {});
//# sourceMappingURL=actions.js.map