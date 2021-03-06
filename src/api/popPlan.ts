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
  const data = await get('/xadvert/videos', query)
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
  const data = await get(`/xadvert/plans/${id}`)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-推广设置
 */
export async function createdDraft(query: any) {
  const data = await post('/xadvert/plans/create/draft', query)
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
  const data = await post('/xadvert/plans/create/direction', query)
  return data
}

/**
 * @param  {any} query
 * 电影搜索接口
 */
export async function searchcinema(query: any) {
  const data = await get('/xadvert/plans/search-movie', query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-预估曝光人次
 */
export async function estimate(query: any) {
  const data = await get('/xadvert/plans/estimate/person', query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-获取数据
 */
export async function getTwodetail() {
  const data = await get('/xadvert/plans/create/before')
  return data
}

/**
 * @param  {any} query
 * 广告方案推荐
 */
export async function getRecommend(query: any) {
  const data = await post('/xadvert/plans/recommend', query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-推广方案
 */
export async function getCheme(query: any) {
  const data = await post('/xadvert/plans/create/scheme', query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-推广方案
 */
export async function getConfim(id: any) {
  const data = await get(`/xadvert/plans/${id}/confirm`)
  return data
}

/**
 * @param  {any} query
 * 查询广告计划关联影院
 */
export async function getcinemas(id: any, query: any) {
  const data = await get(`/xadvert/plans/${id}/cinemas`, query)
  return data
}

/**
 * @param  {any} query
 * 查询广告计划关联院线
 */
export async function getchains(id: any, query: any) {
  const data = await get(`/xadvert/plans/${id}/chains`, query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-推广方案
 */
export async function getcities(id: any, query: any) {
  const data = await get(`/xadvert/plans/${id}/cities`, query)
  return data
}

/**
 * @param  {any} query
 * 创建广告计划-推广方案
 */
export async function getprovinces(id: any, query: any) {
  const data = await get(`/xadvert/plans/${id}/provinces`, query)
  return data
}

/**
 * @param  {any} query
 * 查询票仓城市列表
 */
export async function warehouse() {
  const data = await get(`/xadvert/ticket-warehouse/cities`)
  return data
}

/**
 * @param  {any} query
 * 查询票仓城市列表
 */
export async function exportId(id: any) {
  const data = await get(`/xadvert/plans/export/${id}`)
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
 * 支付定金
 */
export async function payMoney(id: any, query: any) {
  const data = await post(`/xadvert/plans/${id}/pay-deposit`, query)
  return data
}

/**
 * @param  {any} query
 * 缴纳结算金额
 */
export async function payEndMoney(id: any) {
  const data = await post(`/xadvert/plans/${id}/pay-deposit`)
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
 * 获取客户下所关联的账号列表
 */
export async function getaccounts(query: any) {
  const data = await get(`/customer/partners/${query.partnerId}`)
  return data
}

/**
 * @param  {any} query
 * 获取品牌详情
 */
export async function accoutdetail(id: any) {
  const data = await get(`/brand/brands/${id}`)
  return data
}

/**
 * @param  {any} query
 * 电影计划单搜索接口
 */
export async function moviefind(query: any) {
  const data = await get(`/movie/search/xadvert`, query)
  return data
}

/**
 * @param  {any} query
 * 检查影片是否在投放周期内
 */
export async function moviedate(query: any) {
  const data = await get(`/xadvert/plans/check-movie-date`, query)
  return data
}

/**
 * @param  {any} query
 * 更新广告计划投放档期
 */
export async function updatedates(query: any) {
  const data = await post(`/xadvert/plans/change-delivery-cycle`, query)
  return data
}

/**
 * @param  {any} query
 * 更新广告计划投放档期
 */
export async function xlspost(id: any, query: any) {
  const data = await post(`/xadvert/plans/${id}/import-cinemas`, query)
  return data
}

/**
 * @param  {any} query
 * 导出影院
 */
export async function downcinema(id: any, query: any) {
  const data = await get(`/xadvert/plans/export-cinemas`)
  return data
}

/**
 * @param  {any} query
 * 获取账户余额
 */
export async function getmoney(id: any) {
  const data = await get(`/xadvert/plans/${id}/check-before-settle`)
  return data
}

/**
 * @param  {any} query
 * 支付定金前获取定金信息
 */
export async function deposit(id: any) {
  const data = await get(`/xadvert/plans/${id}/check-before-pay-deposit`)
  return data
}

/**
 * @param  {any} query
 * 支付定金前获取定金信息
 */
export async function zfsettle(id: any, query: any) {
  const data = await post(`/xadvert/plans/${id}/settle`, query)
  return data
}
