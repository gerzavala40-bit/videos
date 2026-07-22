import { html, css } from "@benev/slate";
import { Effect } from "./parts/effect.js";
import { shadow_view } from "../../../../context/context.js";
import { getEffectsOnTrack } from "../../../../context/controllers/timeline/utils/get-effects-on-track.js";
export const TextEffect = shadow_view(use => (effect, timeline) => {
    return html `${Effect([
        timeline,
        effect,
        html `${effect.text}`,
        css `
			.content {
				color: white;
				margin-left: 2em;
			}
		`,
        `${!getEffectsOnTrack(use.context.state, effect.track).some(effect => effect.kind !== "text")
            ? `height: 30px;`
            : ""}
			background-color: #5c5b5b;`
    ])}`;
});
//# sourceMappingURL=text-effect.js.map