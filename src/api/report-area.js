import { get } from '@/fn/ajax';
/**
 * 广告成效
 * @param data
 */
export async function planList(data) {
    const res = get('/xadvert/plans/effect', data);
    return res;
}
//# sourceMappingURL=report-area.js.map