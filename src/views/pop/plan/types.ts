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
  { key: 7, text: '奇幻' },
]

export const areaTypeList: KeyText[] = [
  { key: 0, text: '不限' },
  { key: 1, text: '按区域' },
  { key: 2, text: '按省份' },
  { key: 3, text: '按城市' },
  { key: 4, text: '安影院' },
]

export interface Film {
  id: number
  name: string
  date: string
  cover: string
  typeList: number[]
  tags: string
}

export const filmList: Film[] = [
  {
    id: 1,
    name: '《疯狂的外星人》',
    date: '2019年02月05日',
    cover: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgu62ki893rg00800280.jpg',
    typeList: [4, 1, 6],
    tags: '喜剧/剧情/科幻',
  },
  {
    id: 2,
    name: '《新喜剧之王》',
    date: '2019年02月05日',
    cover: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgu62uq893rg0080028g.jpg',
    typeList: [4],
    tags: '喜剧',
  },
  {
    id: 3,
    name: '《情圣2》',
    date: '2019年02月05日',
    cover: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgu63j2893rg00800290.jpg',
    typeList: [4, 5],
    tags: '喜剧/爱情',
  },
  {
    id: 4,
    name: '《飞驰人生》',
    date: '2019年02月05日',
    cover: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgu63pi893rg0080029g.jpg',
    typeList: [4],
    tags: '喜剧',
  },
  {
    id: 5,
    name: '《日不落酒店》',
    date: '2019年02月05日',
    cover: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgu640i893rg008002a0.jpg',
    typeList: [4],
    tags: '喜剧',
  },
  {
    id: 6,
    name: '《神探蒲松龄》',
    date: '2019年02月05日',
    cover: 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bgu646i893rg008002ag.jpg',
    typeList: [3, 7, 4],
    tags: '动作/奇幻/喜剧',
  },
]
