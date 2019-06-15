import { get , post , put } from '@/fn/ajax'

// 影片 - 影人详情 - 更多资料
export async function personIntro(id: any) {
    const res = await get(`/person/${id}/intro`)
    return res
}

// 影片 - 影人详情 - 合作品牌
export async function personBrands(id: any) {
    const res = await get(`/person/${id}/brands`)
    return res
}

// 影片 - 影人详情 - 主要作品
export async function personMovies(id: any) {
    const res = await get(`/person/${id}/movies`)
    return res
}
// 影片 - 影人详情 - TOP作品
export async function topList(id: any, count: any) {
    const res = await get(`/person/${id}/movies/top/${count}`)
    return res
}
