
import { get } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

export async function querylist(query: any) {
  return await mockGet(query, {
    'items|20': [{
      id: tid,
      name: title20,
      time: typeInt(1, 2),
      video: {
        key: typeInt(1, 2),
        name: '12312313.mp4',
      },
      list: [
        {
          key: 2,
          name: title20,
          time: '20s'
        },
        {
          key: 1,
          name: title20,
          time: '20s'
        },
        {
          key: 2,
          name: title20,
          time: '20s'
        },
        {
          key: 1,
          name: title20,
          time: '20s'
        },
        {
          key: 2,
          name: title20,
          time: '20s'
       }
      ]
    }],
    totalCount: 888,
    approvalStatusList: [
      { id: 1, name: '待审核' },
      { id: 2, name: '已通过' },
      { id: 3, name: '已拒绝' },
    ],
  })
}


