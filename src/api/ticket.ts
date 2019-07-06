import { get , post , put , del } from '@/fn/ajax'

// 开票申请列表
export async function queryList(query: any) {
  const res = await get('/kol/invoices', query)
  return res
}

// 编辑开票申请
export async function editticket(id: any , query: any) {
  const res = await put(`/kol/invoices/${id}` , query)
  return res
}

// 保存开票申请
export async function addticket(query: any) {
  const res = await post('/kol/invoices', query)
  return res
}

// 查询开票详情
export async function itemlist(id: any ) {
  const res = await get(`/kol/invoices/${id}` )
  return res
}

// 开票历史
export async function histories(query: any) {
  const res = await get('/kol/invoices/histories', query)
  return res
}


// 查看省市区
export async function viewcity(ids: any) {
  const res = await get(`/basis/districts/${ids}`)
  return res
}


