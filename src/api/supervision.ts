
// import { get } from '@/fn/ajax'
import { get , post , put } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

// export async function querylist(query: any) {
//   return await mockGet(query, {
//     'items|20': [{
//       id: tid,
//       movieName: title20,
//       videoTotalLength: typeInt(1, 2),
//       fileName: '123.mp4',
//       status: typeInt(1, 2),
//       details: [
//         {
//           key: 2,
//           videoName: title20,
//           videoLength: '20s'
//         },
//         {
//           key: 1,
//           videoName: title20,
//           videoLength: '20s'
//         },
//         {
//           key: 2,
//           videoName: title20,
//           videoLength: '20s'
//         },
//         {
//           key: 1,
//           videoName: title20,
//           videoLength: '20s'
//         },
//         {
//           key: 2,
//           videoName: title20,
//           videoLength: '20s'
//        }
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

// 监播
export async function querylist(query: any) {
  const res = await get('/xadvert/v1/play-monitors' , query)
  return res
}

// 获取影院列表
export async function movielist() {
  const res = await get('/customer/cinemas' , {pageIndex: 1 , pageSize: 88888})
  return res
}

// 获取默认影院id
export async function getcinid() {
  const res = await get('/xadvert/v1/play-monitors/default-cinema')
  return res
}


// 上传视频
export async function addvideo(id: any) {
  const res = await put('/xadvert/v1/play-monitors/upload')
  return res
}

// 删除视频
export async function delvideo(id: any) {
  const res = await put('/xadvert/v1/play-monitors/delete')
  return res
}
