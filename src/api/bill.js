// 广告主 -财务管理 -资金账单
import { get } from '@/fn/ajax';
/**
 * 财务管理 -资金账单
 * @param data
 */
export async function bill(data) {
    const res = get('finance/xadvertiser/account-bills', data);
    return res;
}
//# sourceMappingURL=bill.js.map