import { get } from '@/fn/ajax'
import { getTodayDate } from '@/util/validateRules'
import { at, keyBy, omit } from 'lodash'
import { KeyText } from '@/util/types'


// 影人 - 详情页 - 主要作品
export async function getWorks(id: number) {
    const { data: {
        items,
        movieTypes,
        professions
    }} = await get(`/person/${id}/movies`)

    // 查询获取未上映作品（release在今天和今天以前的表示已经上映，在今天以后的表示未上映
}
