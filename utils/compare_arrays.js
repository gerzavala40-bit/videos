export function compare_arrays(originalArray, newArray) {
    const add = [];
    const remove = [];
    for (const item of newArray) {
        if (!originalArray.find(({ id }) => id === item.id)) {
            add.push(item);
        }
    }
    for (const item of originalArray) {
        if (!newArray.find(({ id }) => id === item.id)) {
            remove.push(item);
        }
    }
    return { add, remove };
}
//# sourceMappingURL=compare_arrays.js.map