import { parse } from './array';
import { isNumber } from './type';
/**
 * 找出 obj 中的全部数字 key
 * @param obj 对象
 */
export function numberKeys(obj) {
    return Object.entries(obj)
        .filter(([, val]) => isNumber(val))
        .map(([key]) => key);
}
/**
 * 将对象中的 keys 转成字数字
 * @param obj 对象
 * @param keys 要转成数字的 key
 */
export function numberify(obj, keys) {
    const newObj = { ...obj };
    parse(keys).forEach(key => newObj[key] = +newObj[key]);
    return newObj;
}
//# sourceMappingURL=typeCast.js.map