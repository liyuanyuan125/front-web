import { get , post , put } from '@/fn/ajax'

/**
 * 推广管理 - 广告计划 - 列表
 * @param data
 */
export async function planList(data: any) {
    const res = await get('xadvert/plans', data)
    return res
}
