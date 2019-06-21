import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

/**
 * 搜索接口
 * @param query
 * http://yapi.aiads-dev.com/project/161/interface/api/4974
 */
export async function fetchList(query: any) {
  const res = await get('/movie/search' , query)
  return res
  return await mockGet(query, {
    totalPages: 160,
    'movies|6': [
      {
        movie_id: tid,
        name_cn: '三重威胁之跨国大营救',
        name_en: 'Triple Threat',
        release_date: '20190329',
        main_pic: 'http://img5.mtime.cn/mt/2019/03/20/144544.88506567_1280X720X2.jpg',
        release_status: 0,
        category_code: 'commonly',
        jy_index: 0,
        hots: 0,
        want_see: 9979,
        comments_score: 0,
        update_time: '2019-06-18 18:19:58',
        year_box: 2019,
        year_box_office_rank: 120,
        day_box_office_rank: 1758,
        want_see_rank: 2,
        total_box_office: 1523000,
        types: [
          'Action',
          'Thriller'
        ],
        director: [
          '杰西·约翰逊',
          '查德·斯塔赫斯基'
        ],
        actor: [
          '陈虎',
          '卢靖姗',
          '托尼·贾'
        ]
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
      },
      {
          text: '冒险',
          key: 'Adventure'
      },
      {
          text: '科幻',
          key: 'Sci-Fi'
      },
      {
          text: '动作',
          key: 'Action'
      },
      {
          text: '家庭',
          key: 'Family'
      },
      {
          text: '动画',
          key: 'Animation'
      },
      {
          text: '励志',
          key: 'Encouragement'
      },
      {
          text: '喜剧',
          key: 'Comedy'
      },
      {
          text: '悬疑',
          key: 'Mystery'
      },
      {
          text: '爱情',
          key: 'Romance'
      },
      {
          text: '剧情',
          key: 'Drama'
      }
    ]
  })
}


