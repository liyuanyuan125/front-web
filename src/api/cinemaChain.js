import { get, post, put } from '@/fn/ajax';
// 查询院线信息
export async function queryList(query) {
    const res = await get('/theater/chains', query);
    return res;
}
// 查询单个院线信息
export async function dataFrom(query) {
    const res = await get('/theater/chains', query);
    return res;
}
// 新建院线
export async function add(query) {
    const res = await post('/theater/chains', query);
    return res;
}
// 更新院线
export async function set(query) {
    const res = await put('/theater/chains', query);
    return res;
}
//# sourceMappingURL=cinemaChain.js.map