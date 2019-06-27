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

export async function cinemaList(query: any) {
  const data = await get('/xadvert/plans/movie', query)
  return data
}

// 查看区域
export async function fansList(query: any) {
  const data = await get('/kol/channel-accounts/fans-province-top20', query)
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
export async function adverdetail(id: any) {
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
 * 创建广告计划-定向设置
 */
export async function direction(query: any) {
  const data = await post('/xadvert/v1/plans/create/direction', query)
  return data
}

/**
 * @param  {any} query
 * 电影搜索接口
 */
export async function searchcinema(query: any) {
  const data = await get('/xadvert/v1/plans/search-movie', query)
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

/**
 * @param  {any} query
 * 广告方案推荐
 */
export async function getRecommend(query: any) {
  const data = await post('/xadvert/v1/plans/recommend', query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-推广方案
 */
export async function getCheme(query: any) {
  const data = await post('/xadvert/v1/plans/create/scheme', query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-推广方案
 */
export async function getConfim(id: any) {
  const data = await get(`/xadvert/v1/plans/${id}/confirm`)
  return data
}

/**
 * @param  {any} query
 * 查询广告计划关联影院
 */
export async function getcinemas(id: any, query: any) {
  const data = await get(`/xadvert/v1/plans/${id}/cinemas`, query)
  return data
}

/**
 * @param  {any} query
 * 查询广告计划关联院线
 */
export async function getchains(id: any, query: any) {
  const data = await get(`/xadvert/v1/plans/${id}/chains`, query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-推广方案
 */
export async function getcities(id: any, query: any) {
  const data = await get(`/xadvert/v1/plans/${id}/cities`, query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-推广方案
 */
export async function getprovinces(id: any, query: any) {
  const data = await get(`/xadvert/v1/plans/${id}/provinces`, query)
  return data
}

/**
 * @param  {any} query
 * 查询票仓城市列表
 */
export async function warehouse() {
  const data = await get(`/xadvert/v1/ticket-warehouse/cities`)
  return data
}

/**
 * @param  {any} query
 * 查询票仓城市列表
 */
export async function exportId(id: any) {
  const data = await get(`/xadvert/v1/plans/export/${id}`)
  return data
}

/**
 * @param  {any} query
 * 账户总览信息
 */
export async function financeMsg(id: any) {
  const data = await get(`/finance/xadvertiser/accounts/${id}`)
  return data
}

/**
 * @param  {any} query
 * 缴纳保证金
 */
export async function payMoney(id: any) {
  const data = await post(`/xadvert/v1/plans/${id}/pay`)
  return data
}

/**
 * @param  {any} query
 * 缴纳保证金
 */
export async function getcalendars(query: any) {
  const data = await get(`/basis/calendars`, query)
  return data
}

/**
 * @param  {any} query
 * 电影计划单搜索接口
 */
export async function moviefind(query: any) {
  const data = await get(`/movie/search/advert`, query)
  return data
}
