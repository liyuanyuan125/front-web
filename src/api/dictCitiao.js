import { get, post, put } from '@/fn/ajax';
// 新建词条
export async function add(query) {
    const res = await post('/basis/dictionaries', query);
    return res;
}
// 更新词条
export async function set(query) {
    const res = await put(`/basis/dictionaries/${query.id}`, query);
    return res;
}
export async function dataFrom(query) {
    const res = await get('/basis/dictionaries', query);
    return res;
}
export async function dictqueryList(query) {
    const data = await get('/basis/dictionaries', query);
    return data;
}
//# sourceMappingURL=dictCitiao.js.map