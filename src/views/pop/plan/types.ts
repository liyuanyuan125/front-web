import { KeyText } from '@/util/types'

export interface City {
  id: number
  name: string
  regionId: number
  provinceId: number
  cinemaCount: number
  pinyin: string
}

export const cityList: City[] = [
  { id: 1, name: '北京市', regionId: 1, provinceId: 1, cinemaCount: 318, pinyin: 'beijing' },
  { id: 2, name: '上海市', regionId: 2, provinceId: 2, cinemaCount: 338, pinyin: 'shanghai' },
  { id: 3, name: '广州市', regionId: 3, provinceId: 3, cinemaCount: 388, pinyin: 'guangzhou' },
  { id: 4, name: '深圳市', regionId: 3, provinceId: 3, cinemaCount: 298, pinyin: 'shenzhen' },
  { id: 5, name: '成都市', regionId: 3, provinceId: 4, cinemaCount: 208, pinyin: 'chengdu' },
  { id: 6, name: '南京市', regionId: 2, provinceId: 5, cinemaCount: 218, pinyin: 'nanjing' },
  { id: 7, name: '杭州市', regionId: 2, provinceId: 6, cinemaCount: 268, pinyin: 'hangzhou' },
]

export const sexList: KeyText[] = [
  { key: 0, text: '不限' },
  { key: 1, text: '男性' },
  { key: 2, text: '女性' },
]

export const ageStageList: KeyText[] = [
  { key: 0, text: '不限' },
  { key: 1, text: '20岁以下' },
  { key: 2, text: '20-24岁' },
  { key: 3, text: '25-29岁' },
  { key: 4, text: '30-34岁' },
  { key: 5, text: '35-39岁' },
  { key: 6, text: '40岁以上' },
]

export const filmHobbyList: KeyText[] = [
  { key: 0, text: '不限' },
  { key: 1, text: '剧情' },
  { key: 2, text: '冒险' },
  { key: 3, text: '动作' },
  { key: 4, text: '喜剧' },
  { key: 5, text: '爱情' },
  { key: 6, text: '科幻' },
  // { key: 7, text: '爱情' },
  // { key: 8, text: '记录' },
  // { key: 9, text: '动画' },
  // { key: 10, text: '警匪' },
  // { key: 11, text: '武侠' },
  // { key: 12, text: '网剧' },
  // { key: 13, text: '古装' },
  // { key: 14, text: '战争' },
  // { key: 15, text: '历史' },
  // { key: 16, text: '悲剧' },
]

export const areaTypeList: KeyText[] = [
  { key: 0, text: '不限' },
  { key: 1, text: '按区域' },
  { key: 2, text: '按省份' },
  { key: 3, text: '按城市' },
  { key: 4, text: '安影院' },
]
