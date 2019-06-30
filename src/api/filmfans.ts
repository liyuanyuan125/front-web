import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'


/**
 * 日期区间描述
 * @param data
 */
export async function dayRanges(query: any = { beginDate: 20191212, endDate: 20191212 }, id: number = 107028) {
  return await mockGet(query, {
    dayRanges: [
      {
        key: 'yesterday',
        text: '昨日'
      },
      {
        key: 'last_7_day',
        text: '最近7天'
      },
      {
        key: 'last_30_day',
        text: '最近30天'
      },
      {
        key: 'last_90_day',
        text: '最近90天'
      }
    ],
  })
}
/**
 * comment
 * @param query 起止时间
 * @param id id
 * @description https://yapi.aiads-dev.com/project/146/interface/api/4533
 * @deprecated 缺少数据，起止时间临时使用
 */
export async function comment(query: any, id: string = '') {
  // const res = await get(`/person/${id}/comments`, query)
  // 默认时间有问题，待解决 nxd 20190630
  const res = await get(`/person/${id}/comments`, { beginDate: 20170112, endDate: 20191212 })
  return res
  return await mockGet(query, {
    emotion: [
      {
        key: 'positive',
        text: '正面'
      },
      {
        key: 'passive',
        text: '负面'
      },
      {
        key: 'neutral',
        text: '中性'
      }
    ],
    dayRanges: [
      {
        key: 'yesterday',
        text: '昨日'
      },
      {
        key: 'last_7_day',
        text: '最近7天'
      },
      {
        key: 'last_30_day',
        text: '最近30天'
      },
      {
        key: 'last_90_day',
        text: '最近90天'
      }
    ],
    item: {
      totalCount: tid,
      rate: {
        neutral: tid,
        positive: tid,
        passive: tid
      },
      keywords: {
        yesterday: {
          // 可能没有value 接口无返回
          // 'positive|6': [
          //   {
          //     name: typeTitle(3, 10),
          //     value: Math.floor(Math.random() * 100 + 1)
          //   },
          // ],
          'positive|6': [
            title20
          ],
          'passive|6': [
            title20
          ]
        },
        last_90_day: {
          'positive|6': [
            title20
          ],
          'passive|6': [
            title20
          ]
        },
        last_7_day: {
          'positive|6': [
            title20
          ],
          'passive|6': [
            title20
          ]
        },
        last_30_day: {
          'positive|6': [
            title20
          ],
          'passive|6': [
            title20
          ]
        }
      },
      dates: [
        {
          date: 20190101,
          positive: {
            count: tid,
            trend: tid
          },
          passive: {
            count: tid,
            trend: tid
          },
          neutral: {
            count: tid,
            trend: tid
          }
        },
        {
          date: 20190102,
          positive: {
            count: tid,
            trend: tid
          },
          passive: {
            count: tid,
            trend: tid
          },
          neutral: {
            count: tid,
            trend: tid
          }
        },
        {
          date: 20190103,
          positive: {
            count: tid,
            trend: tid
          },
          passive: {
            count: tid,
            trend: tid
          },
          neutral: {
            count: tid,
            trend: tid
          }
        }
      ]
    },
  })
}

/**
 * 关键词评论列表
 * @param query 起止时间
 * @param id id
 * @description https://yapi.aiads-dev.com/project/146/interface/api/4695
 */
export async function keywordComment(query: any, id: number | string = '') {
  const res = await get(`person/${id}/keyword-comments`, query)
  return res
  return await mockGet(query, {
    'items|10': [
      {
        id: tid,
        commentId: '448934333334811222222218361922554123749479949179weibo',
        content: '又咳fdkddjd的科大大家都jdlslihei-f7ca09d6e8.png" style="width:1em; height:1em;" /></span>',
        favorCount: 111,
        replyCount: 22,
        sourceContent: '医院开的药和现在每天每顿要吃的药，水喝得好饱。。。还老特么卡嗓子眼儿，一打嗝一股混合药味=w= ',
        sourceUrl: 'wwww.baidu.com',
        channelCode: 'weibo',
        channelName: '微博',
        emotionType: 2,
        commentDate: '2017-6-28',
        highLightWords: '咳fdkddjd的科<em style="color:red">大</em>都'
      }
    ],
    totalCount: 2
  })
}

/**
 * fans
 * @param id id
 * @description http://yapi.aiads-dev.com/project/146/interface/api/4524
 */
// 根绝id查询列表详情
// 重复请求地址，待修复 nxd 20190630
export async function film(id: any) {
  const res = await get(`/movie/${id}`)
  return res
}

/**
 * fans
 * 数据排序。待接口修复之后移除。演示临时解决方案 nxd 20190630
 * @param id id
 * @description http://yapi.aiads-dev.com/project/161/interface/api/4751
 */
export async function fans(id: string = '') {
  const res = await get(`/movie/${id}`)
  const { data: { cityLevels, ages } } = res
  if ( cityLevels && cityLevels.length > 0 ) {
    const num: any = {
      一: 1,
      二: 2,
      三: 3,
      四: 4
    }
    res.data.cityLevels = cityLevels.sort((a: any, b: any) => {
      return num[a.k.charAt(0)] - num[b.k.charAt(0)]
    })
  }
  if ( ages && ages.length > 0 ) {
    const num: any = {
      0: 1,
      2: 2,
      3: 3,
      4: 4
    }
    res.data.ages = ages.sort((a: any, b: any) => {
      return num[a.k.charAt(0)] - num[b.k.charAt(0)]
    })
  }
  return res
  return await mockGet({}, {
    id: 55229,
    name: '蜘蛛侠：英雄远征',
    nameEn: 'Spider-Man: Far From Home',
    mainPic: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/06/26/190626120011256765.jpg',
    jyIndex: 7184,
    jyIndexSamePeriodRanking: 1,
    trailers: [
      'https://vf.piaoshen.com/files/misc/2019/06/28/190628000022744551.mp4',
      'https://vf.piaoshen.com/files/misc/2019/06/27/190627120016376409.mp4',
      'https://vf.piaoshen.com/files/misc/2019/06/27/190627000033831620.mp4',
      'https://vf.piaoshen.com/files/misc/2019/06/25/1906250000125944.mp4',
      'https://vf.piaoshen.com/files/misc/2019/06/24/190624120011710995.mp4'
    ],
    personMap: {
      'Produced by': [
        {
          id: 379088,
          name: '斯坦·李',
          nameEn: 'Stan Lee',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/04/18/190418051958311704.jpg',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 419383,
          name: null,
          nameEn: 'Eric Hauserman Carroll',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 351275,
          name: '凯文·费奇',
          nameEn: 'Kevin Feige',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 105559,
          name: '艾米·帕斯卡尔',
          nameEn: 'Amy Pascal',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 358476,
          name: '维多利亚·阿隆索',
          nameEn: 'Victoria Alonso',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 345538,
          name: '路易斯·斯波西托',
          nameEn: 'Louis D\'Esposito',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 105562,
          name: '托马斯·哈梅尔',
          nameEn: 'Thomas M. Hammel',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 105563,
          name: '阿维·阿拉德',
          nameEn: 'Avi Arad',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 419384,
          name: null,
          nameEn: 'David Minkowski',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 318774,
          name: '马修·斯蒂尔曼',
          nameEn: 'Matthew Stillman',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 364886,
          name: '马特·托马齐',
          nameEn: 'Matt Tolmach',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        }
      ],
      Singer: [],
      'Original Music': [
        {
          id: 377447,
          name: '迈克·吉亚奇诺',
          nameEn: 'Michael Giacchino',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/05/22/190522000936392133.jpg',
          movies: null,
          jyIndex: null,
          role: ''
        }
      ],
      Director: [
        {
          id: 377971,
          name: '乔·沃茨',
          nameEn: 'Jon Watts',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/02/04/190204205556586514.jpg',
          movies: null,
          jyIndex: null,
          role: ''
        }
      ],
      Cinematography: [
        {
          id: 404879,
          name: '',
          nameEn: 'Matthew J. Lloyd',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        }
      ],
      'Film Editing': [
        {
          id: 408636,
          name: '',
          nameEn: 'Leigh Folsom',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 408745,
          name: '',
          nameEn: 'Dan Lebental',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        }
      ],
      Dancer: [],
      Casting: [
        {
          id: 358490,
          name: '萨拉·芬恩',
          nameEn: 'Sarah Finn',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 366661,
          name: '吉娜·杰',
          nameEn: 'Jina Jay',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 419385,
          name: null,
          nameEn: 'Maya Kvetny',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        }
      ],
      Dubber: [],
      Compere: [],
      Actor: [
        {
          id: 377012,
          name: '汤姆·赫兰德',
          nameEn: 'Tom Holland',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/04/18/190418062228802687.jpg',
          movies: [
            {
              id: 55132,
              name: '复仇者联盟4：终局之战',
              profession: [
                'Actor'
              ]
            },
            {
              id: 54591,
              name: '复仇者联盟3：无限战争',
              profession: [
                'Actor'
              ]
            },
            {
              id: 54242,
              name: '蜘蛛侠：英雄归来',
              profession: [
                'Actor'
              ]
            },
            {
              id: 53565,
              name: '美国队长3',
              profession: [
                'Actor'
              ]
            },
            {
              id: 54103,
              name: '迷失Z城',
              profession: [
                'Actor'
              ]
            },
            {
              id: 52396,
              name: '海啸奇迹',
              profession: [
                'Actor'
              ]
            }
          ],
          jyIndex: 9000,
          role: '彼得·帕克 / 蜘蛛侠'
        },
        {
          id: 378334,
          name: '杰克·吉伦哈尔',
          nameEn: 'Jake Gyllenhaal',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/04/03/190403111522965915.jpg',
          movies: null,
          jyIndex: null,
          role: '神秘客'
        },
        {
          id: 378380,
          name: '塞缪尔·杰克逊',
          nameEn: 'Samuel L. Jackson',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/04/28/190428120102220470.jpg',
          movies: null,
          jyIndex: null,
          role: '尼克·弗瑞'
        },
        {
          id: 371004,
          name: '赞达亚',
          nameEn: 'Zendaya',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/05/17/190517000524398433.jpg',
          movies: null,
          jyIndex: null,
          role: '米歇尔·琼斯'
        },
        {
          id: 377985,
          name: '雅各·巴塔伦',
          nameEn: 'Jacob Batalon',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/04/24/190424113423355504.jpg',
          movies: null,
          jyIndex: null,
          role: '奈德'
        },
        {
          id: 377983,
          name: '玛丽莎·托梅',
          nameEn: 'Marisa Tomei',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/05/16/190516000509213857.jpg',
          movies: null,
          jyIndex: null,
          role: '梅姨'
        },
        {
          id: 378486,
          name: '乔恩·费儒',
          nameEn: 'Jon Favreau',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/04/18/190418052625818521.jpg',
          movies: null,
          jyIndex: null,
          role: '哈皮'
        },
        {
          id: 362807,
          name: '寇碧·史莫德斯',
          nameEn: 'Cobie Smulders',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/04/24/190424113408213743.jpg',
          movies: null,
          jyIndex: null,
          role: '希尔'
        },
        {
          id: 339910,
          name: '瑞米·海依',
          nameEn: 'Remy Hii',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/02/04/190204194052878815.jpg',
          movies: null,
          jyIndex: null,
          role: '布拉德·戴维斯'
        },
        {
          id: 362987,
          name: '努曼·阿卡尔',
          nameEn: 'Numan Acar',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/04/21/190421000147868798.jpg',
          movies: null,
          jyIndex: null,
          role: 'Dimitri'
        },
        {
          id: 377993,
          name: '马丁·斯塔尔',
          nameEn: 'Martin Starr',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/04/18/190418113315535882.jpg',
          movies: null,
          jyIndex: null,
          role: 'Mr. Harrington'
        },
        {
          id: 311880,
          name: '赫米基·马德拉',
          nameEn: 'Hemky Madera',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/02/04/190204203844539487.jpg',
          movies: null,
          jyIndex: null,
          role: 'Mr. Delmar'
        },
        {
          id: 377987,
          name: '托尼·雷沃罗利',
          nameEn: 'Tony Revolori ',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/02/04/19020419555093351.jpg',
          movies: null,
          jyIndex: null,
          role: '尤金·弗拉什·汤普森'
        },
        {
          id: 374936,
          name: 'JB·斯穆夫',
          nameEn: 'J.B. Smoove',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/02/04/190204210317557699.jpg',
          movies: null,
          jyIndex: null,
          role: 'Mr. Bell'
        },
        {
          id: 398905,
          name: '',
          nameEn: 'Hiten Patel',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'British Station Staff'
        },
        {
          id: 105506,
          name: '艾米丽·吴',
          nameEn: 'Emily Ng',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/05/09/190509120505558746.jpg',
          movies: null,
          jyIndex: null,
          role: 'Italian Tourist       (uncredited)'
        },
        {
          id: 419359,
          name: '',
          nameEn: 'Peter Bankole',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Mob Boss'
        },
        {
          id: 412704,
          name: '',
          nameEn: 'Bruno Bilotta',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Mob Boss 2'
        },
        {
          id: 419360,
          name: '',
          nameEn: 'Thomas Goodridge',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Tourist in Venice'
        },
        {
          id: 378006,
          name: '安格瑞·赖斯',
          nameEn: 'Angourie Rice',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/02/04/190204193422736285.jpg',
          movies: null,
          jyIndex: null,
          role: 'Betty'
        },
        {
          id: 105511,
          name: '约瑟夫·朗',
          nameEn: 'Joseph Long',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/02/04/19020420542698379.jpg',
          movies: null,
          jyIndex: null,
          role: 'Mob Boss'
        },
        {
          id: 398978,
          name: '',
          nameEn: 'Joakim Skarli',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'London Tourist'
        },
        {
          id: 419361,
          name: '',
          nameEn: 'Komal Charania',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Student Boom Operator /              High School Student'
        },
        {
          id: 419362,
          name: '',
          nameEn: 'Ria Fend',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Tourist in Venice'
        },
        {
          id: 419363,
          name: '',
          nameEn: 'Giada Benedetti',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/02/04/190204193422975505.jpg',
          movies: null,
          jyIndex: null,
          role: 'Italian Custom Officer'
        },
        {
          id: 398799,
          name: '',
          nameEn: 'Ken Byrd',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Post Office Customer'
        },
        {
          id: 401254,
          name: '',
          nameEn: 'Mike Ray',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Passerby'
        },
        {
          id: 410879,
          name: '',
          nameEn: 'Dante Brattelli',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'High School Student'
        },
        {
          id: 419364,
          name: '',
          nameEn: 'Amanda Musso',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Carnival Hot Girl       (uncredited)'
        },
        {
          id: 105520,
          name: '戴维娜·西塔拉姆',
          nameEn: 'Davina Sitaram',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/03/01/190301103433585604.jpg',
          movies: null,
          jyIndex: null,
          role: 'London Tourist'
        },
        {
          id: 399363,
          name: '',
          nameEn: 'Ruth Horrocks',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Tourist'
        },
        {
          id: 419365,
          name: '',
          nameEn: 'Sonia Goswami',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Tourist'
        },
        {
          id: 105523,
          name: '杰罗恩·范·科宁斯布格',
          nameEn: 'Jeroen van Koningsbrugge',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/02/04/190204205530774936.jpg',
          movies: null,
          jyIndex: null,
          role: 'Dutch Hooligan 1'
        },
        {
          id: 404782,
          name: '',
          nameEn: 'Jessica VanOss',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Student'
        },
        {
          id: 419366,
          name: '',
          nameEn: 'Ray Rosario',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'TSA Agent'
        },
        {
          id: 418324,
          name: '',
          nameEn: 'Hannah Kurczeski',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Student'
        },
        {
          id: 419367,
          name: '',
          nameEn: 'Leonys Delossantos',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Guy staring at spiderman'
        },
        {
          id: 419368,
          name: '',
          nameEn: 'Daniel Rennis',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Cab Driver'
        },
        {
          id: 400696,
          name: '',
          nameEn: 'Rocco Wu',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/02/04/190204193423339822.jpg',
          movies: null,
          jyIndex: null,
          role: 'Peter\'s Art Classmate'
        },
        {
          id: 419369,
          name: '',
          nameEn: 'Brendan Murphy',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Police Officer'
        },
        {
          id: 419370,
          name: '',
          nameEn: 'Yasmin Mwanza',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Classmate'
        },
        {
          id: 400067,
          name: '',
          nameEn: 'Andrew Dunkelberger',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Courier'
        },
        {
          id: 419371,
          name: '',
          nameEn: 'Luigi Petrazzuolo',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Gondolier'
        },
        {
          id: 404092,
          name: '',
          nameEn: 'Faith Logan',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/06/21/190621000859392623.jpg',
          movies: null,
          jyIndex: null,
          role: 'High School Student       (uncredited)'
        },
        {
          id: 305054,
          name: '迈克尔·曼多',
          nameEn: 'Michael Mando',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/05/25/190525000853639555.jpg',
          movies: null,
          jyIndex: null,
          role: 'Mac Gargan'
        },
        {
          id: 105535,
          name: '托妮·盖恩',
          nameEn: 'Toni Garrn',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/05/25/190525000854124415.jpg',
          movies: null,
          jyIndex: null,
          role: 'The Seamstress'
        },
        {
          id: 319767,
          name: '安东尼·莫伦纳',
          nameEn: 'Anthony Molinari',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/05/25/190525000854597639.jpg',
          movies: null,
          jyIndex: null,
          role: 'Mob Guy'
        },
        {
          id: 428971,
          name: '',
          nameEn: 'Emily Tebbutt',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Venice Tourist- Boat Scene'
        },
        {
          id: 331161,
          name: '马西·弗伦',
          nameEn: 'Massi Furlan',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/05/25/190525000855109413.jpg',
          movies: null,
          jyIndex: null,
          role: 'Flight attendant'
        },
        {
          id: 414950,
          name: '',
          nameEn: 'Jo Wheatley',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/06/10/190610120523594629.jpg',
          movies: null,
          jyIndex: null,
          role: 'Armed Security Officer'
        },
        {
          id: 400119,
          name: '',
          nameEn: 'Annie Pisapia',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Traveler'
        },
        {
          id: 399240,
          name: '',
          nameEn: 'Pietro Arpesella',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Airplane Pilot'
        },
        {
          id: 419372,
          name: '',
          nameEn: 'Lukás Bech',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Farmer'
        },
        {
          id: 404711,
          name: '',
          nameEn: 'Darren Lee Campbell',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Victoria\'s Crew'
        },
        {
          id: 419373,
          name: '',
          nameEn: 'Joe David Walters',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Pawn Shop Owner'
        },
        {
          id: 419374,
          name: '',
          nameEn: 'Daniel Olson',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Czech Guy'
        },
        {
          id: 419375,
          name: '',
          nameEn: 'Daphne Cheung',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Passport Clerk'
        },
        {
          id: 419376,
          name: '',
          nameEn: 'Gavin Lee Lewis',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Londoner'
        },
        {
          id: 419377,
          name: '',
          nameEn: 'Shari Abdul',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'High School Reporter'
        },
        {
          id: 419378,
          name: '',
          nameEn: 'Bradley Wj Miller',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Passerby'
        },
        {
          id: 419379,
          name: '',
          nameEn: 'Aleksandrs Petukhovs',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'London Passerby'
        },
        {
          id: 416716,
          name: '',
          nameEn: 'Lucas Yashere',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Tourist'
        },
        {
          id: 401055,
          name: '',
          nameEn: 'Tyrone Love',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/05/25/190525000857325744.jpg',
          movies: null,
          jyIndex: null,
          role: 'Venice Wedding Guest'
        },
        {
          id: 419380,
          name: '',
          nameEn: 'Cynthia Garbutt',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Charity Dinner Guest       (uncredited)'
        },
        {
          id: 419381,
          name: '',
          nameEn: 'Vincent Paolicelli',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Basketball Player       (uncredited)'
        },
        {
          id: 396378,
          name: '',
          nameEn: 'Hélène Cardona',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Austrian Backpacker'
        },
        {
          id: 419382,
          name: '',
          nameEn: 'Sitara Attaie',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Dutch lady'
        },
        {
          id: 446224,
          name: '',
          nameEn: 'Meagan Holder',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Pretty Tourist'
        },
        {
          id: 398525,
          name: '',
          nameEn: 'Blair Barnette',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Queens Reporter'
        },
        {
          id: 400139,
          name: '',
          nameEn: 'Clay Pel-is',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'London Tourist'
        },
        {
          id: 414829,
          name: '',
          nameEn: 'Graham Paige',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'London Passerby'
        },
        {
          id: 446231,
          name: '',
          nameEn: 'Martin Polak',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Czech Reveler'
        },
        {
          id: 399238,
          name: '',
          nameEn: 'Jake Hanson',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Rooftop Dad       (uncredited)'
        },
        {
          id: 446236,
          name: '',
          nameEn: 'Gian Kalch',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: 'Venetian Fish Stall Owner       (uncredited)'
        }
      ],
      'Costume Design by': [
        {
          id: 397493,
          name: '',
          nameEn: 'Anna B. Sheppard',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        }
      ],
      Writer: [
        {
          id: 301211,
          name: '史蒂夫·迪特寇',
          nameEn: 'Steve Ditko',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 379088,
          name: '斯坦·李',
          nameEn: 'Stan Lee',
          headImg: 'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/04/18/190418051958311704.jpg',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 402476,
          name: '',
          nameEn: 'Chris McKenna',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        },
        {
          id: 402515,
          name: '',
          nameEn: 'Erik Sommers',
          headImg: '',
          movies: null,
          jyIndex: null,
          role: ''
        }
      ]
    },
    types: [
      'Action',
      'Adventure',
      'Comedy'
    ],
    releaseDate: '20190628',
    releaseEndDate: '20190823',
    countries: [
      '美国'
    ],
    celebrityRating: 0,
    searchKeywords: [
      '蜘蛛侠'
    ],
    tags: [
      '展开',
      '漫威',
      '英雄',
      '远征',
      '钢铁侠',
      '蜘蛛',
      '第一',
      '宇宙',
      '官方',
      '时间',
      '但是',
      '预告片',
      '之战',
      '复仇者'
    ],
    languages: [
      '英语'
    ],
    plotPics: [
      'http://piaoshen.oss-cn-beijing.aliyuncs.com/images/movie/2019/06/28/190628000033213169.jpg'
    ],
    genders: [
      // {
      //   gender: 1,
      //   rate: '26.13'
      // },
      // {
      //   gender: 2,
      //   rate: '73.86'
      // }
    ],
    ages: [
      {
        v: '4.93',
        k: '35-39'
      },
      {
        v: '35.22',
        k: '20-24'
      },
      {
        v: '25.08',
        k: '0-19'
      },
      {
        v: '18.82',
        k: '25-29'
      },
      {
        v: '8.13',
        k: '40-100'
      },
      {
        v: '7.80',
        k: '30-34'
      }
    ],
    cityLevels: [
      {
        v: '14.64',
        k: '一线城市'
      },
      {
        v: '40.37',
        k: '二线城市'
      },
      {
        v: '19.73',
        k: '三线城市'
      },
      {
        v: '25.25',
        k: '四线城市'
      }
    ],
    shoppingTypes: [
      {
        v: '16.56',
        k: '电影/演出/体育赛事'
      },
      {
        v: '12.13',
        k: '女装/女士精品'
      },
      {
        v: '10.61',
        k: '男装'
      },
      {
        v: '9.68',
        k: '零食/坚果/特产'
      },
      {
        v: '5.70',
        k: '3C数码配件'
      },
      {
        v: '3.74',
        k: '彩妆/香水/美妆工具'
      },
      {
        v: '3.28',
        k: '文具电教/文化用品/商务用品'
      },
      {
        v: '2.95',
        k: '美容护肤/美体/精油'
      },
      {
        v: '2.57',
        k: '洗护清洁剂/卫生巾/纸/香薰'
      },
      {
        v: '2.50',
        k: '宠物/宠物食品及用品'
      },
      {
        v: '30.24',
        k: '其他'
      }
    ],
    educations: [
      {
        v: '61.27',
        k: '本科'
      },
      {
        v: '33.82',
        k: '专科及以下'
      },
      {
        v: '4.90',
        k: '硕士及以上'
      }
    ],
    jobs: [
      {
        v: '53.01',
        k: '白领/一般职员'
      },
      {
        v: '27.32',
        k: '学生'
      },
      {
        v: '16.84',
        k: '工人/服务业人员'
      },
      {
        v: '2.81',
        k: '公务员'
      }
    ],
    movieTypes: [
      {
        v: '30.62',
        k: '动作'
      },
      {
        v: '25.34',
        k: '冒险'
      },
      {
        v: '11.59',
        k: '喜剧'
      },
      {
        v: '9.07',
        k: '剧情'
      },
      {
        v: '9.02',
        k: '科幻'
      },
      {
        v: '7.43',
        k: '奇幻'
      },
      {
        v: '2.83',
        k: '爱情'
      },
      {
        v: '1.54',
        k: '动画'
      },
      {
        v: '0.71',
        k: '犯罪'
      },
      {
        v: '0.42',
        k: '惊悚'
      },
      {
        v: '1.38',
        k: '其他'
      }
    ],
    releaseDates: [
      {
        countryName: '中国',
        countryNameEn: 'China',
        date: '2019年6月28日'
      },
      {
        countryName: '日本',
        countryNameEn: 'Japan',
        date: '2019年6月28日'
      },
      {
        countryName: '美国',
        countryNameEn: 'USA',
        date: '2019年7月2日'
      },
      {
        countryName: '英国',
        countryNameEn: 'UK',
        date: '2019年7月2日'
      },
      {
        countryName: '新加坡',
        countryNameEn: 'Singapore',
        date: '2019年7月2日'
      },
      {
        countryName: '丹麦',
        countryNameEn: 'Denmark',
        date: '2019年7月2日'
      },
      {
        countryName: '比利时',
        countryNameEn: 'Belgium',
        date: '2019年7月3日'
      },
      {
        countryName: '法国',
        countryNameEn: 'France',
        date: '2019年7月3日'
      },
      {
        countryName: '芬兰',
        countryNameEn: 'Finland',
        date: '2019年7月3日'
      },
      {
        countryName: '菲律宾',
        countryNameEn: 'Philippines',
        date: '2019年7月3日'
      },
      {
        countryName: '瑞典',
        countryNameEn: 'Sweden',
        date: '2019年7月3日'
      },
      {
        countryName: '希腊',
        countryNameEn: 'Greece',
        date: '2019年7月3日'
      },
      {
        countryName: '荷兰',
        countryNameEn: 'Netherlands',
        date: '2019年7月4日'
      },
      {
        countryName: '斯洛伐克',
        countryNameEn: 'Slovakia',
        date: '2019年7月4日'
      },
      {
        countryName: '阿根廷',
        countryNameEn: 'Argentina',
        date: '2019年7月4日'
      },
      {
        countryName: '澳大利亚',
        countryNameEn: 'Australia',
        date: '2019年7月4日'
      },
      {
        countryName: '巴西',
        countryNameEn: 'Brazil',
        date: '2019年7月4日'
      },
      {
        countryName: '中国香港',
        countryNameEn: 'Hong Kong',
        date: '2019年7月4日'
      },
      {
        countryName: '葡萄牙',
        countryNameEn: 'Portugal',
        date: '2019年7月4日'
      },
      {
        countryName: '俄罗斯',
        countryNameEn: 'Russia',
        date: '2019年7月4日'
      },
      {
        countryName: '匈牙利',
        countryNameEn: 'Hungary',
        date: '2019年7月4日'
      },
      {
        countryName: '德国',
        countryNameEn: 'Germany',
        date: '2019年7月4日'
      },
      {
        countryName: '哥伦比亚',
        countryNameEn: 'Colombia',
        date: '2019年7月4日'
      },
      {
        countryName: '捷克',
        countryNameEn: 'Czech Republic',
        date: '2019年7月4日'
      },
      {
        countryName: '土耳其',
        countryNameEn: 'Turkey',
        date: '2019年7月5日'
      },
      {
        countryName: '保加利亚',
        countryNameEn: 'Bulgaria',
        date: '2019年7月5日'
      },
      {
        countryName: '西班牙',
        countryNameEn: 'Spain',
        date: '2019年7月5日'
      },
      {
        countryName: '黎巴嫩',
        countryNameEn: 'Lebanon',
        date: '2019年7月5日'
      },
      {
        countryName: '斯里兰卡',
        countryNameEn: 'Sri Lanka',
        date: '2019年7月5日'
      },
      {
        countryName: '立陶宛',
        countryNameEn: 'Lithuania',
        date: '2019年7月5日'
      },
      {
        countryName: '尼泊尔',
        countryNameEn: 'Nepal',
        date: '2019年7月5日'
      },
      {
        countryName: '沙特阿拉伯',
        countryNameEn: 'Saudi Arabia',
        date: '2019年7月5日'
      },
      {
        countryName: '爱沙尼亚',
        countryNameEn: 'Estonia',
        date: '2019年7月5日'
      },
      {
        countryName: '印度',
        countryNameEn: 'India',
        date: '2019年7月5日'
      },
      {
        countryName: '柬埔寨',
        countryNameEn: 'Cambodia',
        date: '2019年7月5日'
      },
      {
        countryName: '挪威',
        countryNameEn: 'Norway',
        date: '2019年7月5日'
      },
      {
        countryName: '罗马尼亚',
        countryNameEn: 'Romania',
        date: '2019年7月5日'
      },
      {
        countryName: '墨西哥',
        countryNameEn: 'Mexico',
        date: '2019年7月5日'
      },
      {
        countryName: '越南',
        countryNameEn: 'Vietnam',
        date: '2019年7月5日'
      },
      {
        countryName: '意大利',
        countryNameEn: 'Italy',
        date: '2019年7月10日'
      }
    ],
    summary: '故事全面延续“复联4”，蜘。 ',
    predict: 0,
    releaseStatus: 3,
    boxofficeTodayCount: 5863421160000,
    boxofficeTotalCount: 5863421160000,
    boxofficeTodayRanking: 1,
    similarMovies: [
      {
        movieId: '52953',
        name: '王牌特工：特工学院',
        mainPic: 'http://img31.mtime.cn/mt/2015/02/26/093637.92033988_1280X720X2.jpg'
      },
      {
        movieId: '53256',
        name: '蚁人',
        mainPic: 'http://img31.mtime.cn/mt/2015/09/15/163509.99636592_1280X720X2.jpg'
      },
      {
        movieId: '55140',
        name: '大侦探皮卡丘',
        mainPic: 'http://img5.mtime.cn/mt/2019/05/06/105806.73235069_1280X720X2.jpg'
      },
      {
        movieId: '54563',
        name: '死侍',
        mainPic: 'http://img31.mtime.cn/mt/2016/02/12/185812.47394321_1280X720X2.jpg'
      },
      {
        movieId: '55210',
        name: '黑衣人：全球追缉',
        mainPic: 'http://img5.mtime.cn/mt/2019/06/05/113913.77273022_1280X720X2.jpg'
      },
      {
        movieId: '54238',
        name: '银魂',
        mainPic: 'http://img5.mtime.cn/mt/2017/08/21/092150.33975171_1280X720X2.jpg'
      },
      {
        movieId: '54732',
        name: '蚁人2：黄蜂女现身',
        mainPic: 'http://img5.mtime.cn/mt/2018/08/01/102500.50927717_1280X720X2.jpg'
      },
      {
        movieId: '51936',
        name: '黑衣人3',
        mainPic: 'http://img21.mtime.cn/mt/2012/05/15/143504.95133160_1280X720X2.jpg'
      },
      {
        movieId: '54054',
        name: '银河护卫队2',
        mainPic: 'http://img5.mtime.cn/mt/2017/04/01/164328.75628704_1280X720X2.jpg'
      },
      {
        movieId: '55008',
        name: '死侍2：我爱我家',
        mainPic: 'http://img5.mtime.cn/mt/2019/01/15/113907.82092208_1280X720X2.jpg'
      }
    ],
    companyMap: {
      Distributor: [
        {
          name: '索尼发行公司'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Universal Pictures International'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Entertainment Inc.'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'United International Pictures (UIP)'
        },
        {
          name: 'United International Pictures (UIP)'
        },
        {
          name: 'United International Pictures (UIP)'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Warner Bros.'
        },
        {
          name: 'InterCom'
        },
        {
          name: 'United International Pictures (UIP)'
        },
        {
          name: 'Andes Films'
        },
        {
          name: 'Buena Vista Sony Pictures Releasing (BVSPR)'
        },
        {
          name: 'Forum Film'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'B&H Film Distribution'
        },
        {
          name: 'InterComFilm'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Sony Pictures Releasing'
        },
        {
          name: 'Galaxy Distributors'
        },
        {
          name: 'Sony Pictures Releasing'
        }
      ],
      Production: [
        {
          name: '哥伦比亚影业公司'
        },
        {
          name: '漫威影业'
        },
        {
          name: 'Pascal Pictures'
        }
      ]
    },
    categoryList: [
      {
        controlStatus: 1,
        text: '一般影片',
        key: 'commonly'
      },
      {
        controlStatus: 1,
        text: '超级大片',
        key: 'super'
      },
      {
        controlStatus: 1,
        text: '热门大片',
        key: 'popular'
      }
    ],
    typeList: [
      {
        controlStatus: 1,
        text: '儿童',
        key: 'Kids'
      },
      {
        controlStatus: 1,
        text: '历史',
        key: 'History'
      },
      {
        controlStatus: 1,
        text: '纪录片',
        key: 'Documentary'
      },
      {
        controlStatus: 1,
        text: '战争',
        key: 'War'
      },
      {
        controlStatus: 1,
        text: '戏曲',
        key: 'Opera'
      },
      {
        controlStatus: 1,
        text: '音乐',
        key: 'Music'
      },
      {
        controlStatus: 1,
        text: '歌舞',
        key: 'Musical'
      },
      {
        controlStatus: 1,
        text: '犯罪',
        key: 'Crime'
      },
      {
        controlStatus: 1,
        text: '传记',
        key: 'Biography'
      },
      {
        controlStatus: 1,
        text: '青春',
        key: 'Youth'
      },
      {
        controlStatus: 1,
        text: '奇幻',
        key: 'Fantasy'
      },
      {
        controlStatus: 1,
        text: '短片',
        key: 'Short'
      },
      {
        controlStatus: 1,
        text: '惊悚',
        key: 'Thriller'
      },
      {
        controlStatus: 1,
        text: '冒险',
        key: 'Adventure'
      },
      {
        controlStatus: 1,
        text: '科幻',
        key: 'Sci-Fi'
      },
      {
        controlStatus: 1,
        text: '动作',
        key: 'Action'
      },
      {
        controlStatus: 1,
        text: '家庭',
        key: 'Family'
      },
      {
        controlStatus: 1,
        text: '动画',
        key: 'Animation'
      },
      {
        controlStatus: 1,
        text: '励志',
        key: 'Encouragement'
      },
      {
        controlStatus: 1,
        text: '喜剧',
        key: 'Comedy'
      },
      {
        controlStatus: 1,
        text: '悬疑',
        key: 'Mystery'
      },
      {
        controlStatus: 1,
        text: '爱情',
        key: 'Romance'
      },
      {
        controlStatus: 1,
        text: '剧情',
        key: 'Drama'
      }
    ],
    movieCompanyTypeList: [
      {
        controlStatus: 1,
        text: '制作公司',
        key: 'Production'
      },
      {
        controlStatus: 1,
        text: '发行公司',
        key: 'Distributor'
      }
    ],
    movieOccupationTypeList: [
      {
        controlStatus: 1,
        text: '导演',
        key: 'Director'
      },
      {
        controlStatus: 1,
        text: '演员',
        key: 'Actor'
      },
      {
        controlStatus: 1,
        text: '编剧',
        key: 'Writer'
      },
      {
        controlStatus: 1,
        text: '制作人',
        key: 'Produced by'
      },
      {
        controlStatus: 1,
        text: '音乐',
        key: 'Original Music'
      },
      {
        controlStatus: 1,
        text: '摄影',
        key: 'Cinematography'
      },
      {
        controlStatus: 1,
        text: '剪辑',
        key: 'Film Editing'
      },
      {
        controlStatus: 1,
        text: '选角',
        key: 'Casting'
      },
      {
        controlStatus: 1,
        text: '服装',
        key: 'Costume Design by'
      },
      {
        controlStatus: 1,
        text: '配音演员',
        key: 'Dubber'
      },
      {
        controlStatus: 1,
        text: '主持人',
        key: 'Compere'
      },
      {
        controlStatus: 1,
        text: '歌手',
        key: 'Singer'
      },
      {
        controlStatus: 1,
        text: '舞者',
        key: 'Dancer'
      }
    ],
    countryCodeList: [
      {
        controlStatus: 1,
        text: '阿富汗',
        key: 'AFG'
      },
      {
        controlStatus: 1,
        text: '阿尔巴尼亚',
        key: 'ALB'
      },
      {
        controlStatus: 1,
        text: '阿尔及利亚',
        key: 'DZA'
      },
      {
        controlStatus: 1,
        text: '美属萨摩亚',
        key: 'ASM'
      },
      {
        controlStatus: 1,
        text: '安道尔',
        key: 'AND'
      },
      {
        controlStatus: 1,
        text: '安哥拉',
        key: 'AGO'
      },
      {
        controlStatus: 1,
        text: '阿根廷',
        key: 'ARG'
      },
      {
        controlStatus: 1,
        text: '亚美尼亚',
        key: 'ARM'
      },
      {
        controlStatus: 1,
        text: '澳大利亚',
        key: 'AUS'
      },
      {
        controlStatus: 1,
        text: '奥地利',
        key: 'AUT'
      },
      {
        controlStatus: 1,
        text: '阿塞拜疆',
        key: 'AZE'
      },
      {
        controlStatus: 1,
        text: '巴林',
        key: 'BHR'
      },
      {
        controlStatus: 1,
        text: '孟加拉',
        key: 'BGD'
      },
      {
        controlStatus: 1,
        text: '比利时',
        key: 'BEL'
      },
      {
        controlStatus: 1,
        text: '伯利兹',
        key: 'BLZ'
      },
      {
        controlStatus: 1,
        text: '贝宁',
        key: 'BEN'
      },
      {
        controlStatus: 1,
        text: '玻利维亚',
        key: 'BOL'
      },
      {
        controlStatus: 1,
        text: '波斯尼亚和黑塞哥维那',
        key: 'BIH'
      },
      {
        controlStatus: 1,
        text: '巴西',
        key: 'BRA'
      },
      {
        controlStatus: 1,
        text: '保加利亚',
        key: 'BGR'
      },
      {
        controlStatus: 1,
        text: '布基纳法索',
        key: 'BFA'
      },
      {
        controlStatus: 1,
        text: '布隆迪',
        key: 'BDI'
      },
      {
        controlStatus: 1,
        text: '柬埔寨',
        key: 'KHM'
      },
      {
        controlStatus: 1,
        text: '喀麦隆',
        key: 'CMR'
      },
      {
        controlStatus: 1,
        text: '加拿大',
        key: 'CAN'
      },
      {
        controlStatus: 1,
        text: '佛得角',
        key: 'CPV'
      },
      {
        controlStatus: 1,
        text: '中非共和国',
        key: 'CAF'
      },
      {
        controlStatus: 1,
        text: '智利',
        key: 'CHL'
      },
      {
        controlStatus: 1,
        text: '中国',
        key: 'China'
      },
      {
        controlStatus: 1,
        text: '哥伦比亚',
        key: 'COL'
      },
      {
        controlStatus: 1,
        text: '哥斯达黎加',
        key: 'CRI'
      },
      {
        controlStatus: 1,
        text: '科特迪瓦',
        key: 'CIV'
      },
      {
        controlStatus: 1,
        text: '克罗地亚',
        key: 'HRV'
      },
      {
        controlStatus: 1,
        text: '古巴',
        key: 'CUB'
      },
      {
        controlStatus: 1,
        text: '塞浦路斯',
        key: 'CYP'
      },
      {
        controlStatus: 1,
        text: '捷克共和国',
        key: 'CZE'
      },
      {
        controlStatus: 1,
        text: '丹麦',
        key: 'DNK'
      },
      {
        controlStatus: 1,
        text: '吉布提',
        key: 'DJI'
      },
      {
        controlStatus: 1,
        text: '厄瓜多尔',
        key: 'ECU'
      },
      {
        controlStatus: 1,
        text: '埃及',
        key: 'EGY'
      },
      {
        controlStatus: 1,
        text: '萨尔瓦多',
        key: 'SLV'
      },
      {
        controlStatus: 1,
        text: '厄立特里亚',
        key: 'ERI'
      },
      {
        controlStatus: 1,
        text: '爱沙尼亚',
        key: 'EST'
      },
      {
        controlStatus: 1,
        text: '埃塞俄比亚',
        key: 'ETH'
      },
      {
        controlStatus: 1,
        text: '芬兰',
        key: 'FIN'
      },
      {
        controlStatus: 1,
        text: '法国',
        key: 'FRA'
      },
      {
        controlStatus: 1,
        text: '加蓬',
        key: 'GAB'
      },
      {
        controlStatus: 1,
        text: '德国',
        key: 'DEU'
      },
      {
        controlStatus: 1,
        text: '加纳',
        key: 'GHA'
      },
      {
        controlStatus: 1,
        text: '希腊',
        key: 'GRC'
      },
      {
        controlStatus: 1,
        text: '危地马拉',
        key: 'GTM'
      },
      {
        controlStatus: 1,
        text: '几内亚',
        key: 'GIN'
      },
      {
        controlStatus: 1,
        text: '圭亚那',
        key: 'GUY'
      },
      {
        controlStatus: 1,
        text: '洪都拉斯',
        key: 'HND'
      },
      {
        controlStatus: 1,
        text: '匈牙利',
        key: 'HUN'
      },
      {
        controlStatus: 1,
        text: '印度',
        key: 'IND'
      },
      {
        controlStatus: 1,
        text: '印度尼西亚',
        key: 'IDN'
      },
      {
        controlStatus: 1,
        text: '爱尔兰',
        key: 'IRL'
      },
      {
        controlStatus: 1,
        text: '以色列',
        key: 'ISR'
      },
      {
        controlStatus: 1,
        text: '意大利',
        key: 'ITA'
      },
      {
        controlStatus: 1,
        text: '牙买加',
        key: 'JAM'
      },
      {
        controlStatus: 1,
        text: '日本',
        key: 'JPN'
      },
      {
        controlStatus: 1,
        text: '约旦',
        key: 'JOR'
      },
      {
        controlStatus: 1,
        text: '哈萨克斯坦',
        key: 'KAZ'
      },
      {
        controlStatus: 1,
        text: '肯尼亚',
        key: 'KEN'
      },
      {
        controlStatus: 1,
        text: '基里巴斯',
        key: 'KIR'
      },
      {
        controlStatus: 1,
        text: '韩国',
        key: 'KOR'
      },
      {
        controlStatus: 1,
        text: '吉尔吉斯斯坦',
        key: 'KGZ'
      },
      {
        controlStatus: 1,
        text: '老挝',
        key: 'LAO'
      },
      {
        controlStatus: 1,
        text: '拉脱维亚',
        key: 'LVA'
      },
      {
        controlStatus: 1,
        text: '黎巴嫩',
        key: 'LBN'
      },
      {
        controlStatus: 1,
        text: '莱索托',
        key: 'LSO'
      },
      {
        controlStatus: 1,
        text: '利比里亚',
        key: 'LBR'
      },
      {
        controlStatus: 1,
        text: '立陶宛',
        key: 'LTU'
      },
      {
        controlStatus: 1,
        text: '卢森堡',
        key: 'LUX'
      },
      {
        controlStatus: 1,
        text: '马达加斯加',
        key: 'MDG'
      },
      {
        controlStatus: 1,
        text: '马拉维',
        key: 'MWI'
      },
      {
        controlStatus: 1,
        text: '马来西亚',
        key: 'MYS'
      },
      {
        controlStatus: 1,
        text: '马尔代夫',
        key: 'MDV'
      },
      {
        controlStatus: 1,
        text: '马里',
        key: 'MLI'
      },
      {
        controlStatus: 1,
        text: '毛里塔尼亚',
        key: 'MRT'
      },
      {
        controlStatus: 1,
        text: '墨西哥',
        key: 'MEX'
      },
      {
        controlStatus: 1,
        text: '蒙古',
        key: 'MNG'
      },
      {
        controlStatus: 1,
        text: '摩洛哥',
        key: 'MAR'
      },
      {
        controlStatus: 1,
        text: '缅甸',
        key: 'MMR'
      },
      {
        controlStatus: 1,
        text: '纳米比亚',
        key: 'NAM'
      },
      {
        controlStatus: 1,
        text: '尼泊尔',
        key: 'NPL'
      },
      {
        controlStatus: 1,
        text: '荷兰',
        key: 'NLD'
      },
      {
        controlStatus: 1,
        text: '新西兰',
        key: 'NZL'
      },
      {
        controlStatus: 1,
        text: '尼加拉瓜',
        key: 'NIC'
      },
      {
        controlStatus: 1,
        text: '尼日尔',
        key: 'NER'
      },
      {
        controlStatus: 1,
        text: '尼日利亚',
        key: 'NGA'
      },
      {
        controlStatus: 1,
        text: '朝鲜',
        key: 'PRK'
      },
      {
        controlStatus: 1,
        text: '挪威',
        key: 'NOR'
      },
      {
        controlStatus: 1,
        text: '阿曼',
        key: 'OMN'
      },
      {
        controlStatus: 1,
        text: '巴基斯坦',
        key: 'PAK'
      },
      {
        controlStatus: 1,
        text: '巴勒斯坦',
        key: 'PSE'
      },
      {
        controlStatus: 1,
        text: '巴布亚新几内亚',
        key: 'PNG'
      },
      {
        controlStatus: 1,
        text: '巴拉圭',
        key: 'PRY'
      },
      {
        controlStatus: 1,
        text: '秘鲁',
        key: 'PER'
      },
      {
        controlStatus: 1,
        text: '菲律宾',
        key: 'PHL'
      },
      {
        controlStatus: 1,
        text: '波兰',
        key: 'POL'
      },
      {
        controlStatus: 1,
        text: '葡萄牙',
        key: 'PRT'
      },
      {
        controlStatus: 1,
        text: '卡塔尔',
        key: 'QAT'
      },
      {
        controlStatus: 1,
        text: '罗马尼亚',
        key: 'ROU'
      },
      {
        controlStatus: 1,
        text: '俄罗斯',
        key: 'RUS'
      },
      {
        controlStatus: 1,
        text: '卢旺达',
        key: 'RWA'
      },
      {
        controlStatus: 1,
        text: '沙特阿拉伯',
        key: 'SAU'
      },
      {
        controlStatus: 1,
        text: '塞内加尔',
        key: 'SEN'
      },
      {
        controlStatus: 1,
        text: '塞尔维亚,黑山',
        key: 'SCG'
      },
      {
        controlStatus: 1,
        text: '塞拉利昂',
        key: 'SLE'
      },
      {
        controlStatus: 1,
        text: '斯洛伐克',
        key: 'SVK'
      },
      {
        controlStatus: 1,
        text: '斯洛文尼亚',
        key: 'SVN'
      },
      {
        controlStatus: 1,
        text: '所罗门群岛',
        key: 'SLB'
      },
      {
        controlStatus: 1,
        text: '南非',
        key: 'ZAF'
      },
      {
        controlStatus: 1,
        text: '西班牙',
        key: 'ESP'
      },
      {
        controlStatus: 1,
        text: '斯里兰卡',
        key: 'LKA'
      },
      {
        controlStatus: 1,
        text: '苏丹',
        key: 'SDN'
      },
      {
        controlStatus: 1,
        text: '苏里南',
        key: 'SUR'
      },
      {
        controlStatus: 1,
        text: '瑞典',
        key: 'SWE'
      },
      {
        controlStatus: 1,
        text: '瑞士',
        key: 'CHE'
      },
      {
        controlStatus: 1,
        text: '叙利亚',
        key: 'SYR'
      },
      {
        controlStatus: 1,
        text: '塔吉克斯坦',
        key: 'TJK'
      },
      {
        controlStatus: 1,
        text: '坦桑尼亚',
        key: 'TZA'
      },
      {
        controlStatus: 1,
        text: '泰国',
        key: 'THA'
      },
      {
        controlStatus: 1,
        text: '东帝汶',
        key: 'TLS'
      },
      {
        controlStatus: 1,
        text: '多哥',
        key: 'TGO'
      },
      {
        controlStatus: 1,
        text: '汤加',
        key: 'TON'
      },
      {
        controlStatus: 1,
        text: '突尼斯',
        key: 'TUN'
      },
      {
        controlStatus: 1,
        text: '土耳其',
        key: 'TUR'
      },
      {
        controlStatus: 1,
        text: '土库曼斯坦',
        key: 'TKM'
      },
      {
        controlStatus: 1,
        text: '乌干达',
        key: 'UGA'
      },
      {
        controlStatus: 1,
        text: '乌克兰',
        key: 'UKR'
      },
      {
        controlStatus: 1,
        text: '阿拉伯联合酋长国',
        key: 'ARE'
      },
      {
        controlStatus: 1,
        text: '英国',
        key: 'GBR'
      },
      {
        controlStatus: 1,
        text: '美国',
        key: 'USA'
      },
      {
        controlStatus: 1,
        text: '乌拉圭',
        key: 'URY'
      },
      {
        controlStatus: 1,
        text: '乌兹别克斯坦',
        key: 'UZB'
      },
      {
        controlStatus: 1,
        text: '瓦努阿图',
        key: 'VUT'
      },
      {
        controlStatus: 1,
        text: '委内瑞拉',
        key: 'VEN'
      },
      {
        controlStatus: 1,
        text: '越南',
        key: 'VNM'
      },
      {
        controlStatus: 1,
        text: '白俄罗斯',
        key: 'BLR'
      },
      {
        controlStatus: 1,
        text: '也门',
        key: 'YEM'
      },
      {
        controlStatus: 1,
        text: '赞比亚',
        key: 'ZMB'
      },
      {
        controlStatus: 1,
        text: '津巴布韦',
        key: 'ZWE'
      }
    ],
    genderCodeList: [
      {
        text: '未知',
        key: 0
      },
      {
        text: '男',
        key: 1
      },
      {
        text: '女',
        key: 2
      }
    ],
    wantToSeeTotalCount: 1547377,
    wantToSeeSamePeriodRanking: 1
  })
}

/**
 * matching 影人受众匹配
 * @param query
 * @description 在那屋
 */
export async function matching(query: any) {
  return await mockGet(query, {
    chart1: {
      dataList: [{
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 0
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 1
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 0
      }, {
        date: '2019-01-01',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 1
      }],
      effectTypeList1: [{
        text: 'Papi酱',
        key: 0
      }, {
        text: '奔驰',
        key: 1
      }],
      effectTypeList2: [{
        text: '男',
        key: 0
      }, {
        text: '女',
        key: 1
      }]
    },
    chart2: {
      dataList: [{
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 0,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 1,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 2,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 3,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 0,
        key2: 4,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 0,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 1,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 2,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 3,
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1,
        key2: 4,
      }],
      effectTypeList1: [{
        text: 'Papi酱',
        key: 0
      }, {
        text: '奔驰',
        key: 1
      }],
      effectTypeList2: [{
        text: '19岁及以下',
        key: 0
      }, {
        text: '20-29岁',
        key: 1
      }, {
        text: '30-29岁',
        key: 2
      }, {
        text: '40-49岁',
        key: 3
      }, {
        text: '50岁及以上',
        key: 4
      }]
    },
    chart3: {
      dataList: [{
        itemName: '广东',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '北京',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '江苏',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '广东',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '江苏省',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '浙江省',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }],
      effectTypeList: [{
        text: 'Papi酱',
        key: 0
      }, {
        text: '奔驰',
        key: 1
      }]
    },
    chart4: {
      dataList: [{
        itemName: '重庆',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '上海',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '天津',
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        itemName: '广东',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '厦门',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        itemName: '浙江省',
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }],
      effectTypeList: [{
        text: 'Papi酱',
        key: 0
      }, {
        text: '奔驰',
        key: 1
      }]
    }
  })
}

/**
 * trend
 * @param data
 */
export async function trend(query: any) {
  // const res = await get('/person/${id}/hot' , query)
  // return res
  return await mockGet(query, {
    items: [
      {
        date: 20190101,
        count: tid,
        ranking: 3, // 综合热度在同类中的排名
        trend: 0, // 综合热度排名变化趋势，正负数分别表示上升和下降名词
        channels: [
          {
            name: '微博', // 平台名称
            count: 29526, // 热度
            ranking: 3, // 在当前平台排名
            trend: 0  // 正负数表示上升或者下降名次
          },
          {
            name: '微信',
            count: 29526,
            ranking: 3,
            trend: 0
          },
          {
            name: '百度',
            count: 29526,
            ranking: 3,
            trend: 0
          },
          {
            name: '头条',
            count: 29526,
            ranking: 3,
            trend: 0
          }
        ]
      },
      {
        date: 20190102,
        count: tid,
        ranking: 3,
        trend: 0,
        channels: [
          {
            name: '微博',
            count: 29526,
            ranking: 3,
            trend: 0
          },
          {
            name: '微信',
            count: 29526,
            ranking: 3,
            trend: 0
          },
          {
            name: '百度',
            count: 29526,
            ranking: 3,
            trend: 0
          },
          {
            name: '头条',
            count: 29526,
            ranking: 3,
            trend: 0
          }
        ]
      },
      {
        date: 20190103,
        count: tid,
        ranking: 3,
        trend: 0,
        channels: [
          {
            name: '微博',
            count: 29526,
            ranking: 3,
            trend: 0
          },
          {
            name: '微信',
            count: 29526,
            ranking: 3,
            trend: 0
          },
          {
            name: '百度',
            count: 29526,
            ranking: 3,
            trend: 0
          },
          {
            name: '头条',
            count: 29526,
            ranking: 3,
            trend: 0
          }
        ]
      }
    ]
  })
}

/**
 * 品牌列表含分页
 * @param query name pageIndex	pageSize
 * @description http://yapi.aiads-dev.com/mock/152/brand/brands
 */
export async function brands(query: any) {
  const res = await get(`/brand/brands`, query)
  return res
  return await mockGet(query, {
    item: {
      totalCount: 83724,
    }
  })
}
