/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(func: Function, delay: number) {
    // @ts-ignore
    let timeoutId;
    // @ts-ignore
    return function (...args) {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;
        // @ts-ignore
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}
