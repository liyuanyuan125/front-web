
// import { get } from '@/fn/ajax'
import { get , post , put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

// export async function queryList(query: any) {
//   return await mockGet(query, {
//     'items|20': [{
//       id: tid,
//       movieName: title20,
//       videoTotalLength: typeInt(1, 2),
//       details: [
//         {
//           status: 2,
//           videoName: title20,
//           operationTime: '20s'
//         },
//         {
//           status: 1,
//           videoName: title20,
//           operationTime: '20s'
//         },
//         {
//           status: 2,
//           videoName: title20,
//           operationTime: '20s'
//         },
//         {
//           status: 1,
//           videoName: title20,
//           operationTime: '20s'
//         },
//         {
//           status: 2,
//           videoName: title20,
//           operationTime: '20s'
//         }
//       ]
//     }],
//     totalCount: 888,
//     approvalStatusList: [
//       { id: 1, name: '待审核' },
//       { id: 2, name: '已通过' },
//       { id: 3, name: '已拒绝' },
//     ],
//   })
// }

// 上刊列表
export async function queryList(query: any) {
  const res = await get('/xadvert/v1/upper-shelfs' , query)
  return res
}

// 获取影院列表
export async function movielist(query: any) {
  const res = await get('/customer/cinemas' , query)
  return res
}

// 获取默认影院id
export async function getcinid() {
  const res = await get('/xadvert/v1/upper-shelfs/default-cinema')
  return res
}


// 单个设置上刊状态
export async function oneover(id: any , query: any) {
  const res = await put( `/xadvert/v1/upper-shelfs/${id}/setup` , query)
  return res
}

// 单个设置下刊状态
export async function oneout(id: any , query: any) {
  const res = await put(`/xadvert/v1/upper-shelfs/${id}/cannel` , query)
  return res
}

// 批量设置上刊状态
export async function allover(query: any) {
  const res = await put(`/xadvert/v1/upper-shelfs/batch` , query)
  return res
}


export async function itemlist(query: any) {
  return await mockGet(query, {
    'items|20': [{
      id: tid,
      name: title20,
      type: '搞笑',
      weibo: '‘微博',
      zhifa: 'title20',
      price: '167210',
      createTimeTemp: dateRange(),
      con: title20,
    }],
    totalCount: 888,
    approvalStatusList: [
      { id: 1, name: '待审核' },
      { id: 2, name: '已通过' },
      { id: 3, name: '已拒绝' },
    ],
  })
}

