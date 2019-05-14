import { get, post } from '@/fn/ajax';
/**
 * @export 查看关联影院列表
 * @param {*} query
 * https://yapi.aiads.com/project/94/interface/api/1031
 * TODO: 注意，这个方法不是查询所有影院列表的接口
 * TODO: 这个不应该放在这里，应该放在 customer 或者别的文件里
 */
export async function cinmeaList(query) {
    return get('/customer/cinemas', query);
}
/**
 * @export 获取影院详情
 * @param {*} id
 * @returns
 */
export async function cinmeaId(id) {
    return get(`/theater/cinemas/${id}`);
}
/**
 * 查询影院统计信息
 * @param query 查询参数
 * https://yapi.aiads.com/project/103/interface/api/1538
 * 预防 GET 参数长度有限制，改为 POST 请求
 */
export async function queryStats(query = {}) {
    const res = post('/theater/cinemas/statistics', query);
    return res;
}
/**
 * 分页查询影院列表（根据ids做IN操作）
 * @param query 查询参数
 * https://yapi.aiads.com/project/103/interface/api/845
 */
export async function queryAll(query = {}) {
    const res = get('/theater/cinemas', query);
    return res;
}
//# sourceMappingURL=cinema.js.map