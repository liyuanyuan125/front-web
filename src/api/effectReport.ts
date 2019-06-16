import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

// 计划
export async function searchplan(query: any) {
  return await mockGet(query, {
    items: [{
      id: 55077,
      nameCn: '唐人街探案3',
      releaseDate: 20200125,
      type: ['剧情', '动作'],
      director: ['导演1', '导演2'],
      actor: ['演员1', '演员2'],
      wish: 88655,
      image: null
    },
    {
      id: 55078,
      nameCn: '囧妈',
      releaseDate: 20200125,
      type: ['剧情', '喜剧'],
      director: ['导演1', '导演2'],
      actor: ['演员1', '演员2'],
      wish: 6985,
      image: null
    },
    {
      id: 55165,
      nameCn: '中国女排',
      releaseDate: 20200125,
      type: ['剧情', '运动'],
      director: ['导演1', '导演2'],
      actor: ['演员1', '演员2'],
      wish: 3691,
      image: null
    },
    {
      id: 55076,
      nameCn: '摸金校尉之九幽将军',
      releaseDate: 20191001,
      type: ['动作', '奇幻'],
      director: ['导演1', '导演2'],
      actor: ['演员1', '演员2'],
      wish: 248425,
      image: null
    }],
    totalCount: 20
  })
}

/**
 * 客户
 * @param data
 */
export async function popPartners(data: any) {
  const res = await get('/customer/partners', data)
  return res
}

/**
 * 计划
 * @param data
 */
export async function popPlans(data: any) {
  const res = await get('/xadvert/plans', data)
  return res
}
