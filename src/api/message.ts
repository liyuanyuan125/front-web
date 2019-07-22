import { get, post, put } from '@/fn/ajax'
import { mockGet, tid, title20, dateRange } from './mock'

/**
 * 搜索接口(含分页)
 * @param query pageIndex	pageSize
 * @description https://yapi.aiads-dev.com/project/189/interface/api/5356
 */
export async function messageList(query: any) {
  const res = await get(`/message/notification/search`, query, {
    timeout: 1500
  })
  const title = `广告片【 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、
        《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》
        年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】
        -《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中
        有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女
        将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》
        、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》`
  res.data.items.forEach((it: any) => {
    it.title = title
  })
  return res
  return await mockGet(query, {
    items: [
      {
        id: tid,
        title: `广告片【 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、
        《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》
        年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】
        -《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中
        有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女
        将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》
        、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》`,
        status: 1,
        icon: '//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bko3flboeqg0008u9gk0.png',
        name: '紧急下刊',
        sendTime: '2019-07-18T20:13:30.967',
      },
      {
        id: tid,
        title: `广告片【 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、
        《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》
        年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】
        -《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中
        有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女
        将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》
        、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》`,
        status: 2,
        icon: '//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bko3flboeqg0008u9gk0.png',
        name: '紧急下刊',
        sendTime: '2019-07-19T20:13:30.967',
      },
      {
        id: tid,
        title: `广告片【 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、
        《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》
        年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】
        -《风中有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中
        有朵雨做的云》、《杨门女将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女
        将》、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》
        、《流浪地球》 年轻有wey（45s）】-《风中有朵雨做的云》、《杨门女将》、《流浪地球》`,
        status: 1,
        icon: '//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bko3flboeqg0008u9gk0.png',
        name: '紧急下刊',
        sendTime: '2019-07-18T20:13:30.967',
      }
    ],
    totalCount: 11,
    status: [
      {
        key: 1,
        text: '未读'
      },
      {
        key: 2,
        text: '已读'
      }
    ]
  })
}

/**
 * 读取站内信
 * @description https://yapi.aiads-dev.com/project/189/interface/api/5357
 */
export async function readItem(id: string = '') {
  const res = await get(`message/notification/read/${id}`)
  return res
}

/**
 * 全部标记为已读
 * @description https://yapi.aiads-dev.com/project/189/interface/api/5360
 */
export async function readAll() {
  const res = await put(`message/notification/read`)
  return res
}
