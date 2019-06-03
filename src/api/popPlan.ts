import { mockGet, tid, title20, dateRange } from './mock'
import { get , post , put } from '@/fn/ajax'

/**
 * @param
 */
export async function orienteering(query: any) {
  return await mockGet(query, {
    cityList: [
      { key: 1, text: '全国' },
      { key: 2, text: '一级城市' },
      { key: 3, text: '二级城市' },
    ],
    cinemaList: [
      { key: 1, text: '一星' },
      { key: 2, text: '二星' },
      { key: 3, text: '三星' },
      { key: 4, text: '四星' },
      { key: 5, text: '五星' },
    ],
    sexList: [
      { key: 1, text: '男' },
      { key: 2, text: '女' },
    ],
    ageList: [
      { key: 1, text: '20' },
      { key: 2, text: '30' },
    ],
    typeList: [
      { key: 1, text: '科幻' },
      { key: 2, text: '悬疑' },
    ],
    'items|3': [{
      id: tid,
      name: title20,
      mainPicUrl: 'https://p.ssl.qhimg.com/dmfd/400_300_/t0120b2f23b554b8402.jpg',
      openTime: dateRange(),
      type: ['科幻', '悬疑', '惊悚'],
      sex: '男',
      age: 25,
      viewNumber: 1234567,
      matching: 99.6,
      week: '2019/6/1~2019/6/7'
    }],
  })
}

// 影片分页
export async function cinemaFilm(query: any) {
  return await mockGet(query, {
    'items|6': [{
      id: tid,
      name: title20,
      mainPicUrl: 'https://p.ssl.qhimg.com/dmfd/400_300_/t0120b2f23b554b8402.jpg',
      openTime: dateRange(),
      type: ['科幻', '悬疑', '惊悚'],
      sex: '男',
      start: '1星',
      viewNumber: 1234567,
      matching: 99.6,
      week: '2019/6/1~2019/6/7'
    }],
  })
}

export async function cinemaList(query: any) {
  const data = await get('/xadvert/plans/movie', query)
  return data
}

// 查询广告片列表(含分页)
export async function advertising(query: any) {
  const data = await get('/xadvert/v1/videos', query)
  return data
}

// 影片
export async function cinemaFind(query: any) {
  const data = await get('/xadvert/plans/movie', query)
  return data
}

/**
 * 获取大区列表
 */
export async function getRegionList() {
  const { data } = await get('/basis/areas')
  return (data || [])
}

/**
 * @param  {any} query
 * 广告计划详情
 */
export async function adverdetail(id: number) {
  const data = await get(`/xadvert/v1/plans/${id}`)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-推广设置
 */
export async function createdDraft(query: any) {
  const data = await post('/xadvert/v1/plans/create/draft', query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-定向设置
 */
export async function createdDirection(query: any) {
  const data = await post('/xadvert/plans/create/direction', query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-定向设置
 */
export async function createdScheme(query: any) {
  const data = await post('/xadvert/plans/create/scheme', query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-预估曝光人次
 */
export async function estimate(query: any) {
  const data = await get('/xadvert/v1/plans/estimate/person', query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-获取数据
 */
export async function getTwodetail() {
  const data = await get('/xadvert/v1/plans/create/before')
  return data
}
