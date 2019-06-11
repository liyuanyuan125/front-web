import { get, post, put } from '@/fn/ajax'

// 获取行业，渠道， 国家list
export async function querySelectList() {
  const res = get('/brand/brands/before')
  return res
}

// 多个品牌默认列表
export async function brandList(data: any) {
  const res = get('/brand/brand-relation/self-list', data)
  return res
}

// 新建品牌
export async function createBrand(data: any) {
    const res = post('/brand/brand-relation/save', data)
    return res
}

// 品牌list列表 模糊查询
export async function selectBrand(data: any) {
    const res = get('/brand/brands', data)
    return res
}

// 基础数据（品牌详情）
export async function baseList(id: any) {
  const res = get(`/brand/brands/${id}`)
  return res
}
// 编辑基础数据
export async function editBase(data: any) {
  const res = put('/brand/brands', data)
  return res
}


// 门店列表list
export async function shopList(data: any) {
  const res = get('/brand/stores', data)
  return res
}

// 门店创建
export async function createList(data: any) {
  const res = post('/brand/stores', data)
  return res
}
// 门店修改
export async function editList(data: any) {
  const res = put('/brand/stores', data)
  return res
}
// 门店删除
export async function delShopList(id: any) {
  const res = put(`/brand/stores/${id}`)
  return res
}

// 媒体平台list
export async function mediaList(data: any) {
  const res = get('/brand/medias', data)
  return res
}
// 创建媒体平台
export async function createMedia(data: any) {
  const res = post('/brand/medias', data)
  return res
}
// 编辑媒体平台
export async function editMedia(data: any) {
  const res = put('/brand/medias', data)
  return res
}
// 删除媒体平台
export async function delMadia(id: any) {
  const res = put(`/brand/medias/${id}`)
  return res
}

// 产品列表
export async function productList(data: any) {
  const res = await get('brand/products', data)
  return res
}
// 创建产品
export async function createProduct(data: any) {
  const res = await post('brand/products', data)
  return res
}
// 修改产品
export async function editProduct(data: any) {
  const res = await put('brand/products', data)
  return res
}
