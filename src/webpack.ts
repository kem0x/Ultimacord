import { isOfType, isOfTypeT } from './utils';

// i had to give up the live server support
export const Window = (unsafeWindow as any);

interface IModule {
    id: string;
    exports: any;
}

export function getModulesCache() {
    getExposed<Function>("originalWebpackChunkdiscordAppPush")([[Symbol("Ultimacord")], {}, (m: any) => expose("modulesCache", Object.values(m.c))]);

    Window.webpackChunkdiscord_app.pop();

    return Object.values(getExposed<any>("modulesCache")) as IModule[];
}

Window.ultimacord = Window.ultimacord || {};

// exposes objects to the ultimacord object on the window
export function expose(name: string, any: any) {
    Window.ultimacord[name] = any;
}

export function getExposed<Type>(name: string) {
    return (Window.ultimacord[name] as Type);
}

function findInternal(lambda: (module: any) => boolean) {
    for (const module of getModulesCache()) {

        if (!module?.exports)
            continue;

        if (lambda(module.exports))
            return module.exports;

        if (!isOfTypeT<Object>(module.exports))
            continue;

        if (module.exports.default && lambda(module.exports.default))
            return module.exports.default;

        for (const nestedModule of Object.values(module.exports)) {
            if (nestedModule && lambda(nestedModule)) {
                return nestedModule;
            }
        }
    }

    return null;
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
    }
}