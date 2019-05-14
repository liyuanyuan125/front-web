import { get, post, put } from '@/fn/ajax';
export async function queryList() {
    const res = await get('/xadvert/plans/view');
    return res;
}
// i新建计划
export async function addplan(query) {
    const res = await post('/xadvert/plans', query);
    return res;
}
// i编辑计划
export async function editplan(id, query) {
    const res = await put(`/xadvert/plans/${id}`, query);
    return res;
}
// 预估场次
export async function abcount(query) {
    const res = await get('/xadvert/plans/estimate-count', query);
    return res;
}
// 方案价格计算
export async function pricount(query) {
    const res = await get('/xadvert/plans/price-calculation', query);
    return res;
}
// 推荐影片
export async function tuijian(query) {
    const res = await get('/xadvert/plans/movie', query);
    return res;
}
// 推荐影片
export async function TcinemaList(query) {
    const res = await post('/theater/cinemas/page-query', query);
    return res;
}
export async function video(id) {
    const res = await get(`/xadvert/videos/${id}`);
    return res;
}
export async function dataFrom(query) {
    const res = await get('/xadvert/plans', query);
    return res;
}
//# sourceMappingURL=planput.js.map