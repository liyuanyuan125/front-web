import { get } from '@/fn/ajax';
export async function queryList(id) {
    const data = await get(`/xadvert/execute-orders/${id}/video-dcp-list`);
    return data;
}
//# sourceMappingURL=dcp.js.map