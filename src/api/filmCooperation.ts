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
          key: 'commonly',
          controlStatus: 1
      },
      {
          text: 'test分类',
          key: 'test',
          controlStatus: 0
      },
      {
          text: '超级大片',
          key: 'super',
          controlStatus: 1
      },
      {
          text: '热门大片',
          key: 'popular',
          controlStatus: 0
      }
    ],
    typeList: [
      {
          text: '儿童',
          key: 'Kids',
          controlStatus: 0
      },
      {
          text: '历史',
          key: 'History',
          controlStatus: 1
      },
      {
          text: '纪录片',
          key: 'Documentary',
          controlStatus: 1
      },
      {
          text: '战争',
          key: 'War',
          controlStatus: 1
      },
      {
          text: '戏曲',
          key: 'Opera',
          controlStatus: 1
      },
      {
          text: '音乐',
          key: 'Music',
          controlStatus: 1
      },
      {
          text: '歌舞',
          key: 'Musical',
          controlStatus: 1
      },
      {
          text: '犯罪',
          key: 'Crime',
          controlStatus: 1
      },
      {
          text: '传记',
          key: 'Biography',
          controlStatus: 1
      },
      {
          text: '青春',
          key: 'Youth',
          controlStatus: 1
      },
      {
          text: '奇幻',
          key: 'Fantasy',
          controlStatus: 1
      },
      {
          text: '短片',
          key: 'Short',
          controlStatus: 1
      },
      {
          text: '惊悚',
          key: 'Thriller',
          controlStatus: 1
      },
      {
          text: '冒险',
          key: 'Adventure',
          controlStatus: 1
      },
      {
          text: '科幻',
          key: 'Sci-Fi',
          controlStatus: 1
      },
      {
          text: '动作',
          key: 'Action',
          controlStatus: 1
      },
      {
          text: '家庭',
          key: 'Family',
          controlStatus: 1
      },
      {
          text: '动画',
          key: 'Animation',
          controlStatus: 1
      },
      {
          text: '励志',
          key: 'Encouragement',
          controlStatus: 1
      },
      {
          text: '喜剧',
          key: 'Comedy',
          controlStatus: 1
      },
      {
          text: '悬疑',
          key: 'Mystery',
          controlStatus: 1
      },
      {
          text: '爱情',
          key: 'Romance',
          controlStatus: 1
      },
      {
          text: '剧情',
          key: 'Drama',
          controlStatus: 0
      }
    ]
  })
}


