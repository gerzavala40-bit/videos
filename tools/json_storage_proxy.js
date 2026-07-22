export function json_storage_proxy(storage, prefix = "") {
    return new Proxy({}, {
        get(_, key) {
            const fullKey = `${prefix}${key}`;
            const json = storage.getItem(fullKey);
            try {
                return json ? JSON.parse(json) : undefined;
            }
            catch (error) {
                return undefined;
            }
        },
        set(_, key, value) {
            const fullKey = `${prefix}${key}`;
            try {
                const json = JSON.stringify(value);
                storage.setItem(fullKey, json);
                return true;
            }
            catch (error) {
                return false;
            }
        },
        deleteProperty(_, key) {
            const fullKey = `${prefix}${key}`;
            storage.removeItem(fullKey);
            return true;
        }
    });
}
//# sourceMappingURL=json_storage_proxy.js.map