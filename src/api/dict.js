import { get, post, put } from '@/fn/ajax';
export async function queryList(query) {
    const data = await get('/basis/dictionary-categories', query);
    return data;
}
// 新建
export async function add(query) {
    const res = await post('/basis/dictionary-categories', query);
    return res;
}
export async function dataFrom(query) {
    const res = await get('/basis/dictionary-categories', query);
    return res;
}
// 编辑
export async function set(query) {
    const res = await put(`/basis/dictionary-categories/${query.id}`, query);
    return res;
}
export async function dictqueryList(query) {
    const data = await get('/basis/dictionaries', query);
    return data;
}
//# sourceMappingURL=dict.js.map