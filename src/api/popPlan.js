import { get } from '@/fn/ajax';
// 档期查询
export async function drairesList(query) {
    const data = await get('/basis/calendars', query);
    return data;
}
// 创建计划前获取类型数据
export async function beforePlan() {
    const data = await get('/xadvert/plans/view');
    return data;
}
// 查询广告片列表(含分页)
export async function advertising(query) {
    const data = await get('/xadvert/videos', query);
    return data;
}
// 查询广告片信息
export async function advertDetail(id) {
    const data = await get(`/xadvert/videos/${id}`);
    return data;
}
// 查询广告片信息
export async function cinemaList(query) {
    const data = await get('/xadvert/plans/movie', query);
    return data;
}
//# sourceMappingURL=popPlan.js.map