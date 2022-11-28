import { isOfType, isOfTypeT } from './utils';

// i had to give up the live server support
export const Window = (unsafeWindow as any);

Window.ultimacord = Window.ultimacord || {};

// exposes objects to the ultimacord object on the window
export function expose(name: string, any: any) {
    Window.ultimacord[name] = any;
}

export function getExposed<Type>(name: string) {
    return (Window.ultimacord[name] as Type);
}

interface IPatch {
    replacement?: Function;
    before?: Function;
    after?: Function;
}

function findInternal(lambda: (module: any) => boolean) {
    let cache: any;
    Window.webpackChunkdiscord_app.push([[Symbol("Ultimacord")], {}, (m: any) => cache = Object.values(m.c)]);
    Window.webpackChunkdiscord_app.pop();

    for (let module in cache) {

        if (!cache[module]?.exports)
            continue;

        if (lambda(cache[module].exports))
            return cache[module].exports;

        if (!isOfTypeT<Object>(cache[module].exports))
            continue;

        if (cache[module].exports.default && lambda(cache[module].exports.default))
            return cache[module].exports.default;

        for (let nestedModule in cache[module].exports) {
            if (cache[module].exports[nestedModule] && lambda(cache[module].exports[nestedModule])) {
                return cache[module].exports[nestedModule];
            }
        }
    }

    return null;
}

function patchInternal(lambda: (module: any) => boolean, patch: IPatch) {

    if (!patch.replacement && !patch.before && !patch.after)
        throw new Error("Patch must have a replacement, before or after function");

    let cache: any;
    Window.webpackChunkdiscord_app.push([[Symbol("Ultimacord")], {}, (m: any) => cache = Object.values(m.c)]);
    Window.webpackChunkdiscord_app.pop();

    for (let module in cache) {

        if (!cache[module]?.exports)
            continue;

        if (!isOfTypeT<Object>(cache[module].exports))
            continue;

        for (let nestedModule in cache[module].exports) {
            if (cache[module].exports[nestedModule] && lambda(cache[module].exports[nestedModule])) {

                if (!isOfType(cache[module].exports[nestedModule], "function"))
                    throw new Error("Patch target is not a function");

                console.log("Found function!");

                if (patch.replacement) {
                    console.log("Patching with replacement");
                    cache[module].exports[nestedModule] = patch.replacement;
                }

                const original = cache[module].exports[nestedModule];

                if (patch.before) {
                    console.log("Patching with before");
                    cache[module].exports[nestedModule] = function (...args: any[]) {
                        if (patch.before) {
                            patch.before(...args);
                        }

                        return original(...args);
                    }
                }

                if (patch.after) {
                    console.log("Patching with after");
                    cache[module].exports[nestedModule] = function (...args: any[]) {
                        const result = original(...args);

                        if (patch.after) {
                            patch.after(result, ...args);
                        }

                        return result;
                    }
                }

                return true;
            }
        }
    }

    return false;
}

export const Find = {
    ByProps: (...props: string[]) => {
        return findInternal(module => props.every(prop => module[prop] !== undefined));
    },

    ByDisplayName: (name: string) => {
        return findInternal(module => module.default.displayName === name);
    },

    ByCode: (...code: string[]) => {
        return findInternal(module => isOfType(module, "function") && code.every(c => (module as Function).toString().includes(c)));
    },

    ByPrototypes: (...prototypes: string[]) => {
        return findInternal(module => prototypes.every(prototype => module.prototype[prototype] !== undefined));
    },

    ByLambda: (lambda: (module: any) => boolean) => {
        return findInternal(lambda);
    },

    ByRegex: (regex: RegExp) => {
        return findInternal(module => isOfType(module, "function") && regex.test((module as Function).toString()));
    },

    Debug: (regex: RegExp, patch: IPatch) => {
        return patchInternal(module => isOfType(module, "function") && regex.test((module as Function).toString()), patch);
    },
}
