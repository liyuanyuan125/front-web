import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from '@/api/mock'

/**
 * 获取监播视频
 * @param query
 * https://yapi.aiads-dev.com/project/139/interface/api/6294
 */
export async function fetchList(planId: string, query: any) {
  const res = await get(`/xadvert/plans/${planId}/report/monitors`, query)
  return res
  return await mockGet(query, {
    totalCount: 46,
    'items|11': [{
        id: tid,
        uploadTime: 1568963456834,
        beginDate: 20190926,
        endDate: 20191002,
        cinemaId: 10025,
        cinemaName: title20,
        movieId: 55356,
        movieName: title20,
        url: '',
        img: '//aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bm27n03lqfo000804iqg.mp4?x-oss-process=video'
      }
    ]
  })
}

/**
 * 获取单个监播视频信息
 * @param query
 * https://yapi.aiads-dev.com/project/139/interface/api/6295
 */
export async function fetchItem(mid: string) {
  const res = await get(`/xadvert/plans/report/monitors/${mid}`)
  return res
  return await mockGet({}, {
    id: '5d8471e8abd68f5cd1a3e9a1',
    uploadTime: 1568963456834,
    beginDate: 20190926,
    endDate: 20191002,
    cinemaId: 10025,
    cinemaName: '江口大星光影城',
    movieId: 55356,
    movieName: '拂乡心',
  })
}


