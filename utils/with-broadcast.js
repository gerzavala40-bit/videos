export function withBroadcast(action, broadcastFn) {
    return (...args) => {
        return (...actionArgs) => {
            let omit = false;
            const param = actionArgs[actionArgs.length - 1];
            // Check if the last argument is an options object with the 'omit' property
            if (param &&
                typeof param === 'object' &&
                'omit' in param) {
                const options = actionArgs.pop();
                omit = options.omit ?? false;
            }
            const actualArgs = actionArgs;
            const result = action(...args)(...actualArgs);
            if (!omit) {
                broadcastFn(action.name, actualArgs);
            }
            return result;
        };
    };
}
//# sourceMappingURL=with-broadcast.js.map