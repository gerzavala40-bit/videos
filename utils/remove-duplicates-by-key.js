export function removeDuplicatesByKey(arr, keyName) {
    const uniqueByName = new Map();
    arr.forEach((item) => {
        if (!uniqueByName.has(item[keyName])) {
            uniqueByName.set(item[keyName], item);
        }
    });
    return Array.from(uniqueByName.values());
}
//# sourceMappingURL=remove-duplicates-by-key.js.map