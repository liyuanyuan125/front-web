import {baseDecode, baseEncode} from './universalBase64'

export function decode(str: string) {
    return baseDecode(str.replace(/\-/g, '+').replace(/_/g, '/'))
}

export function encode(str: string ) {
    return baseEncode(str)
        .replace(/\//g, '_')
        .replace(/\+/g, '-')
        .replace(/=+$/, '')
}
