import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

/**
 * fetchList
 * @param query
 */
export async function fetchList(query: any) {
  // const res = await get('/movie/cooperation/' , query)
  // return res
  return await mockGet(query, {
    'movies|12': [
      {
        movie_id: tid,
        name_cn: title20,
        name_en: 'Run',
        release_date: '20120106',
        is_hots: 0,
        category_code: 'commonly',
        jy_index: tid,
        hots: 0,
        want_see: 0,
        comments_score: 0,
        update_time: '2019-06-15 12:11:33',
        types: [
          'Horror',
          'Thriller',
          'Mystery'
        ],
        movieMainPic: 'http://img5.mtime.cn/pi/2017/12/26/112527.39995952_220X220.jpg'
      }
    ],
    categoryList: [
      {
        text: '一般影片',
        key: 'commonly'
      },
      {
        text: 'test分类',
        key: 'test'
      },
      {
        text: '超级大片',
        key: 'super'
      },
      {
        text: '热门大片',
        key: 'popular'
      }
    ],
    typeList: [
      {
        text: '儿童',
        key: 'Kids'
      },
      {
        text: '历史',
        key: 'History'
      },
      {
        text: '纪录片',
        key: 'Documentary'
      },
      {
        text: '战争',
        key: 'War'
      },
      {
        text: '戏曲',
        key: 'Opera'
      },
      {
        text: '音乐',
        key: 'Music'
      },
      {
        text: '歌舞',
        key: 'Musical'
      },
      {
        text: '犯罪',
        key: 'Crime'
      },
      {
        text: '传记',
        key: 'Biography'
      },
      {
        text: '青春',
        key: 'Youth'
      },
      {
        text: '奇幻',
        key: 'Fantasy'
      },
      {
        text: '短片',
        key: 'Short'
      },
      {
        text: '惊悚',
        key: 'Thriller'
      }
    ],
    totalPages: 35
  })
}


