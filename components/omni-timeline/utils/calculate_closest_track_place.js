import { calculate_effect_width } from "./calculate_effect_width.js";
export function calculate_closest_track_place(effect, cords, track_height, zoom) {
    const [x, y] = cords;
    const track_index = Math.floor(y / 50);
    const track_start = track_index * track_height;
    const width = calculate_effect_width(effect, zoom);
    const position = {
        y: track_start,
        x: x - width / 2
    };
    return [position.x, position.y];
}
//const track_end = (track_index + 1) * track_height
//const margin = 5
//const start_at = y >= track_start + margin
//const end_at = y <= track_end - margin
//# sourceMappingURL=calculate_closest_track_place.js.map