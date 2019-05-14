import { get } from '@/fn/ajax';
/**
 * 资源方 - 财务管理 - 财务信息
 * @param data
 */
export async function resInfo(data) {
    const res = get('finance/resource/withdrawals', data);
    return res;
}
//# sourceMappingURL=resourceBill.js.map