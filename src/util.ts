/**
 *
 * @param length Tamanho de caracteres que o ID terá
 * @param type Tipos de caracteres que é permitido conter no ID, por padrão o valor é ``0``.
 *
 * ``0`` — Permite letras maiúscula, minúscula e números
 *
 * ``1`` — Permite letras maiúscula e minúscula
 *
 * ``2`` — Permite apenas letras maiúscula
 *
 * ``3`` — Permite apenas letras minúscula
 *
 * ``4`` — Permite apenas números
 */
export function createID(length: number, type: number = 0) {
    let base = '',
        r = '';

    if (type < 0 || type > 4) return;
    switch (type) {
        case 1:
            base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            break;
        case 2:
            base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            break;
        case 3:
            base = 'abcdefghijklmnopqrstuvwxyz';
            break;
        case 4:
            base = '0123456789';
            break;
        default:
            base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            break;
    }

    for (let i = 0; i < length; i++) {
        const c = base.charAt(Math.random() * base.length);
        r += c;
    }

    return r;
}

//- Randomizer
export function randomize(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//- Number shorter
export function miliarize(numstring: number | string, strict: Boolean) {
    if (typeof numstring == 'number') {
        numstring = numstring.toString();
    }
    if (numstring.length < 4) return numstring;
    //-- -- -- -- --
    let stashe = numstring.replace(/\B(?=(\d{3})+(?!\d))/g, '.').toString();
    let stash;
    // Gibe precision pls
    if (strict) {
        stash = stashe.split('.');
        switch (stash.length) {
            case 1:
                return stash;
            case 2:
                if (stash[1] != '000') break;
                return stash[0] + 'K';
            case 3:
                if (stash[2] != '000') break;
                return stash[0] + '.' + stash[1][0] + stash[1][1] + 'Mi';
            case 4:
                if (stash[3] != '000') break;
                return stash[0] + '.' + stash[1][0] + stash[1][1] + 'Bi';
        }
        return stashe;
    }
    // Precision is not a concern
    stash = stashe.split('.');
    switch (stash.length) {
        case 1:
            return stash.join(' ');
        case 2:
            if (stash[0].length <= 1) break;
            return stash[0] + 'K';
        case 3:
            return stash[0] + 'Mi';
        case 4:
            return stash[0] + 'Bi';
    }
    return stashe;
}

//- Wait on Secs
export async function wait(time: number) {
    time = typeof time == 'number' ? time : 1000;
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, time * 1000 || 1000);
    });
}

//- Capitalize
export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
