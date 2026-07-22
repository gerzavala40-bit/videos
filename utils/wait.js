export function wait(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, seconds * 1000);
    });
}
//# sourceMappingURL=wait.js.map