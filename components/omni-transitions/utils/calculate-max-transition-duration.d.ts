import { State } from "../../../context/types.js";
import { Transition } from "../../../context/controllers/compositor/parts/transition-manager.js";
export declare function calculateMaxTransitionDuration(transition: Transition | undefined, state: State): number;
