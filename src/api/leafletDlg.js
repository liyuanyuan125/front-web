import { get, post, put } from '@/fn/ajax';
// 广告单影院列表
export async function queryList() {
    const res = await get('/xadvert/dispatchs');
    return res;
}
// 广告单影院列表
export async function leafletList(id, query) {
    const res = await get(`/xadvert/dispatchs/${id}/cinemas`, query);
    return res;
}
// 广告单 确认接单
export async function sureLeaflet(query) {
    const res = await post('/xadvert/dispatchs/accept', query);
    return res;
}
// 执行单影院列表
export async function findCinema(id, query) {
    const res = await get(`/xadvert/dispatchs/${id}/cinemas`, query);
    return res;
}
// 执行单影院列表
export async function carryList(id, query) {
    const res = await get(`/xadvert/execute-orders/${id}/cinemas`, query);
    return res;
}
// 查看执行单关联影院
export async function findcarry(id, query) {
    const res = await get(`/xadvert/execute-orders/${id}/check/cinemas`, query);
    return res;
}
// 修改执行单
export async function carrySet(id, query) {
    const res = await put(`/xadvert/execute-orders/${id}/cinemas`, query);
    return res;
}
// 修改执行单
export async function carryRefuse(id) {
    const res = await put(`/xadvert/dispatchs/${id}/refuse`);
    return res;
}
//# sourceMappingURL=leafletDlg.js.map