export type LogType = "log" | "warn" | "error" | "debug" | "info";

export function print(type: LogType, ...args: string[]) {
    console[type](`%c ultimacord `, `background: #5865f2; color: black; font-weight: bold; border-radius: 5px; `, ...args);
}

export function sleep(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
}

export function waitFor(condition: () => boolean) {

    const poll = (resolve: Function) => {
        if (condition()) resolve();
        else setTimeout(_ => poll(resolve), 400);
    }

    return new Promise(poll);
}

export function whenDefined(object: any, prop: any, callback: () => void) {
    if (object[prop]) {
        callback();
    } else {
        Object.defineProperty(object, prop, {
            configurable: true,
            enumerable: true,
            get: function () {
                return this['_' + prop];
            },
            set: function (val) {
                this['_' + prop] = val;
                callback();
            }
        });
    }
};

export function Lazy<T>(getter: () => T): () => T {
    let value: T;
    return () => value || (value = getter());
}

export function isOfTypeT<T>(object: any): object is T {
    return typeof object === typeof ({} as T);
}

export function isOfType(object: any, type: string): boolean {
    return typeof object === type;
}

export function isIterable<T>(object: any): object is Iterable<T> {
    return typeof object[Symbol.iterator] === "function";
}