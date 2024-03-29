import { Hook } from './hook';
import { IPatch } from './patcher';
import { isOfType, isOfTypeT, print } from './utils';

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

export function Find(lambda: (module: any) => boolean) {
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

export function Patch(patch: IPatch) {

    if (!patch.replacement && !patch.before && !patch.after)
        print("warn", "Patch must have a replacement, before or after function, nothing is going to be patched.");

    let cache: any;
    Window.webpackChunkdiscord_app.push([[Symbol("Ultimacord")], {}, (m: any) => cache = Object.values(m.c)]);
    Window.webpackChunkdiscord_app.pop();

    for (let module in cache) {

        if (!cache[module]?.exports)
            continue;

        if (!isOfTypeT<Object>(cache[module].exports))
            continue;

        for (let nestedModule in cache[module].exports) {
            if (
                cache[module].exports[nestedModule] &&
                patch.filter(cache[module].exports[nestedModule])
            ) {

                if (patch.replacement) {
                    cache[module].exports[nestedModule] = patch.replacement;
                }

                const isTypeFunction = isOfTypeT<Object>(cache[module].exports[nestedModule]) && isOfType(cache[module].exports[nestedModule]?.type, "function");

                if (isTypeFunction) print("warn", "Your filter " + patch.filter + " seems to match a type function, is that correct?");

                // console.log(original);

                if (patch.before) {
                    Hook.Before(
                        (isTypeFunction ? cache[module].exports[nestedModule] : cache[module].exports),
                        (isTypeFunction ? "type" : nestedModule),
                        patch.before);
                }

                if (patch.after) {
                    Hook.After(
                        (isTypeFunction ? cache[module].exports[nestedModule] : cache[module].exports),
                        (isTypeFunction ? "type" : nestedModule),
                        patch.after);
                }

                return true;
            }
        }
    }

    return false;
}

export const Filters = {
    Props: (...props: string[]) => (module: any) => props.every(prop => module[prop] !== undefined),

    DisplayName: (name: string) => (module: any) => module.default.displayName === name,

    Prototypes: (...prototypes: string[]) => (module: any) => prototypes.every(prototype => module.prototype[prototype] !== undefined),

    Code: (...code: string[]) => (module: any) => isOfType(module, "function") && code.every(c => (module as Function).toString().includes(c)),

    Regex: (regex: RegExp) => (module: any) => isOfType(module, "function") && regex.test((module as Function).toString()),

    ReactType: (...code: string[]) => (module: any) => code.every(c => module.type?.toString().includes(c)),
}