import { get, post, del } from '@/fn/ajax'

/**
 * 收藏渠道类型
 * https://yapi.aiads-dev.com/project/94/interface/api/4981
 */
export enum ChannelType {
  movie = 1,
  figure = 2,
  kol = 3,
  weibo = 4,
  wechat = 5,
  douyin = 6,
  kuaishou = 7,
  xiaohongshu = 8,
}

/**
 * 添加收藏
 * @param dataId 要关注的对象 ID
 * @param channelType 电影:1; 影人:2; KOL:3; 微博:4; 微信:5; 抖音:6; 快手:7; 小红书:8
 * https://yapi.aiads-dev.com/project/94/interface/api/4981
 */
export async function addFav(dataId: number, channelType: ChannelType) {
  const { data: recordId } = await post('/customer/favorites', {
    dataId,
    channelType
  })
  return recordId
}

/**
 * 取消收藏
 * @param dataId 要关注的对象 ID
 * @param channelType 电影:1; 影人:2; KOL:3; 微博:4; 微信:5; 抖音:6; 快手:7; 小红书:8
 * https://yapi.aiads-dev.com/project/94/interface/api/4988
 */
export async function delFav(dataId: number, channelType: ChannelType) {
  await del('/customer/favorites', {
    dataIdList: [ dataId ],
    channelType
  })
}

/**
 * 获取 KOL 收藏列表
 * https://yapi.aiads-dev.com/project/94/interface/api/5037
 */
export async function kolFavList() {
  const {
    data: {
      items
    }
  } = await get('/customer/favorites/kols')

  return items as any[] || []
}

/**
 * KOl 是否已收藏
 * @param id kol id
 */
export async function kolHasFav(id: number) {
  const list = await kolFavList()
  const item = list.find(it => it.id == id)
  return item != null
}

/**
 * KOL 添加或取消收藏
 * @param id kol id
 * @param doAdd 是否添加收藏
 */
export async function kolSetFav(id: number, doAdd: boolean) {
  (doAdd ? addFav : delFav)(id, ChannelType.kol)
}

/**
 * 获取影人收藏列表
 * https://yapi.aiads-dev.com/project/94/interface/api/5002
 */
export async function figureFavList() {
  const {
    data: {
      items
    }
  } = await get('/customer/favorites/persons')

  const list = (items as any[] || []).map(it => ({
    ...it,
    id: it.personId
  }))

  return list
}

/**
 * 影人是否已收藏
 * @param id kol id
 */
export async function figureHasFav(id: number) {
  const list = await figureFavList()
  const item = list.find(it => it.id == id)
  return item != null
}

/**
 * 影人添加或取消收藏
 * @param id kol id
 * @param doAdd 是否添加收藏
 */
export async function figureSetFav(id: number, doAdd: boolean) {
  (doAdd ? addFav : delFav)(id, ChannelType.figure)
}
