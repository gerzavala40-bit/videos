import { AnyEffect } from "../context/types.js";
export declare function compare_arrays(originalArray: AnyEffect[], newArray: AnyEffect[]): {
    add: (import("../context/types.js").VideoEffect | import("../context/types.js").AudioEffect | import("../context/types.js").TextEffect | import("../context/types.js").ImageEffect)[];
    remove: (import("../context/types.js").VideoEffect | import("../context/types.js").AudioEffect | import("../context/types.js").TextEffect | import("../context/types.js").ImageEffect)[];
};
