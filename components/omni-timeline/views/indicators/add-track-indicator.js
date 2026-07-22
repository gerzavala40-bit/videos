import { html } from "@benev/slate";
import { light_view } from "../../../../context/context.js";
export const AddTrackIndicator = light_view(use => (index) => {
    const drag = use.context.controllers.timeline.effectDragHandler;
    const [indicator, setIndicator] = use.state(false);
    const drag_events = {
        drop(e) {
            setIndicator(false);
        },
        end(e) {
            setIndicator(false);
        },
        enter: () => {
            if (drag.grabbed) {
                setIndicator(true);
            }
        },
        leave: () => setIndicator(false)
    };
    return html `
		<div
			?data-indicate=${indicator ? true : false}
			class="indicator"
		>
		</div>
		<div
			@pointerenter=${drag_events.enter}
			@pointerleave=${drag_events.leave}
			@pointerup=${drag_events.drop}
			@pointercancel=${drag_events.end}
			?data-indicate=${indicator ? true : false}
			data-indicator="add-track"
			data-index=${index}
			class="indicator-area"
		>
		</div>
	`;
});
//# sourceMappingURL=add-track-indicator.js.map