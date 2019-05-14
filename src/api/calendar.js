import { get, post, put, del } from '@/fn/ajax';
export async function queryList(query) {
    const res = await get('/basis/calendars', query);
    return res;
}
// 新建档期
export async function add(query) {
    const res = await post('/basis/calendars', query);
    return res;
}
export async function dataFrom(query) {
    const res = await get('/basis/calendars', query);
    return res;
}
// 更新档期
export async function set(query) {
    const res = await put(`/basis/calendars/${query.id}`, query);
    return res;
}
// 删除档期
export async function dels(query) {
    const res = await del(`/basis/calendars/${query.id}`, query);
    return res;
}
//# sourceMappingURL=calendar.js.map