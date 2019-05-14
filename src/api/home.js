import { get } from '@/fn/ajax';
export async function effect(query) {
    const res = await get('/xadvert/plans/effect', query);
    return res;
}
export async function nums(query) {
    const res = await get('/xadvert/plans/data', query);
    return res;
}
// 广告主概览
export async function aisdata() {
    const res = await get('/xadvert/plans/statistics');
    return res;
}
// 资源方概览
export async function resdata() {
    const res = await get('/xadvert/execute-orders/statistics-all');
    return res;
}
// 查看广告成效
export async function viewdata(query) {
    const res = await get('/xadvert/plans/effectStatistics', query);
    return res;
}
//# sourceMappingURL=home.js.map