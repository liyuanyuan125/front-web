import { get, post } from '@/fn/ajax';
// 充值记录
export async function queryList(query) {
    const res = await get('/finance/recharges', query);
    return res;
}
// 财产信息
export async function moneyList(companyId) {
    const res = await get(`/finance/xadvertiser/accounts/${companyId}`);
    return res;
}
// 默认财务信息银行卡
export async function defaultList(query) {
    const res = await get('/finance/settings/default', query);
    return res;
}
// 新建财务信息
export async function add(query) {
    const res = await post('/finance/recharges', query);
    return res;
}
export async function dataFrom(query) {
    const res = await get('/finance/recharges', query);
    return res;
}
//# sourceMappingURL=financeinfo.js.map