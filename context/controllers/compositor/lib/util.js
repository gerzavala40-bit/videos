export const Keys = obj => {
    //@ts-ignore
    return Object.keys(obj);
};
export function omit(obj, fields) {
    const clone = { ...obj };
    if (Array.isArray(fields)) {
        fields.forEach(key => {
            delete clone[key];
        });
    }
    return clone;
}
//# sourceMappingURL=util.js.map