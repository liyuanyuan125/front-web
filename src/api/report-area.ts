import { get, post, put } from '@/fn/ajax'

/**
 * 广告成效
 * @param data
 */
export async function planList(data: any) {
    const res = get('/xadvert/plans/effect', data)
    return res
}

