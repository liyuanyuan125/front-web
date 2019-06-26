import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

/**
 * 品牌列表含分页
 * @param query name pageIndex	pageSize
 * @description http://yapi.aiads-dev.com/mock/152/brand/brands
 */
export async function getBrands(query: any) {
  const res = await get(`/brand/brands`, query)
  return res
  return await mockGet(query, {
    item: {
      totalCount: 83724,
    }
  })
}

/**
 * fans
 * @param id id
 * @description http://yapi.aiads-dev.com/project/146/interface/api/4524
 */
export async function fans(id: number = 0) {
  // const res = await get(`/person/${id}/fans`)
  // return res
  return await mockGet({}, {
    item: {
      totalCount: 83724,
      genders: [
        {
          gender: 1,
          count: tid,
        },
        {
          gender: 2,
          count: tid,
        }
      ],
      ages: [
        {
          v: tid,
          k: '18岁以下'
        },
        {
          v: tid,
          k: '18-25岁'
        },
        {
          v: tid,
          k: '26-30岁'
        },
        {
          v: tid,
          k: '31-40岁'
        },
        {
          v: tid,
          k: '40岁以上'
        }
      ],
      cities: [
        {
          v: tid,
          k: '广州'
        },
        {
          v: tid,
          k: '北京'
        }
      ],
      provinces: [
        {
          v: tid,
          k: '广东'
        },
        {
          v: tid,
          k: '江苏'
        },
        {
          v: tid,
          k: '浙江'
        }
      ]
    },
    genders: [
      {
        key: 0,
        text: '未知'
      },
      {
        key: 1,
        text: '男'
      },
      {
        key: 2,
        text: '女'
      }
    ]
  })
  return await mockGet({}, {
    chart1: {
      dataList: [{
        data: Math.floor(Math.random() * 100 + 1),
        key: 0
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }],
      coverCinema: 8,
      advertAmount: 1069.0,
      coverPeople: 856,
      coverScene: 92,
      effectTypeList: [{
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
        key: 0
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 1
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 2
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 3
      }, {
        data: Math.floor(Math.random() * 100 + 1),
        key: 4
      }],
      effectTypeList: [{
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
        key: 0,
        name: '省份'
      },
      {
        key: 1,
        name: '城市'
      }]
    }
  })
}

/**
 * kol对比
 * @param data
 * @description http://yapi.aiads-dev.com/project/144/interface/api/4953
 * 2061   3898, 5173, 5178, 5203, 5937, 7884, 8386, 11571, 13299,
 */
export async function compare(query: any) {
  // query = {
  //   ids: '3898, 5173'
  // }
  // const res = await get(`/kol/accounts/compare` , query)
  // return res
  return await mockGet(query, {
    items: [
      {
        value: [
          {
            kolId: 3898,
            totalCount: 7995661,
            femaleRate: 8422,
            maleRate: 1578,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 5944
              },
              {
                k: '18-24',
                v: 0,
                r: 2874
              },
              {
                k: '25-29',
                v: 0,
                r: 718
              },
              {
                k: '30-39',
                v: 0,
                r: 406
              },
              {
                k: '40-49',
                v: 0,
                r: 12
              },
              {
                k: '≥50',
                v: 0,
                r: 46
              }
            ],
            provinces: [
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 718
              },
              {
                id: 24,
                name: '四川省',
                count: 0,
                rate: 533
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 368
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 347
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 334
              },
              {
                id: 32,
                name: '湖南省',
                count: 0,
                rate: 316
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 281
              },
              {
                id: 30,
                name: '重庆市',
                count: 0,
                rate: 272
              },
              {
                id: 5,
                name: '福建省',
                count: 0,
                rate: 245
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 233
              }
            ],
            cities: [
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 359
              },
              {
                id: 354,
                name: '深圳市',
                count: 0,
                rate: 323
              },
              {
                id: 302,
                name: '成都市',
                count: 0,
                rate: 320
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 221
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 208
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 200
              },
              {
                id: 387,
                name: '长沙市',
                count: 0,
                rate: 190
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 168
              },
              {
                id: 372,
                name: '重庆市',
                count: 0,
                rate: 163
              },
              {
                id: 87,
                name: '厦门市',
                count: 0,
                rate: 147
              }
            ]
          },
          {
            kolId: 5173,
            totalCount: 10438893,
            femaleRate: 6283,
            maleRate: 3717,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 1530
              },
              {
                k: '18-24',
                v: 0,
                r: 4295
              },
              {
                k: '25-29',
                v: 0,
                r: 2024
              },
              {
                k: '30-39',
                v: 0,
                r: 1274
              },
              {
                k: '40-49',
                v: 0,
                r: 497
              },
              {
                k: '≥50',
                v: 0,
                r: 380
              }
            ],
            provinces: [
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 693
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 693
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 594
              },
              {
                id: 7,
                name: '江西省',
                count: 0,
                rate: 495
              },
              {
                id: 2,
                name: '辽宁省',
                count: 0,
                rate: 495
              },
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 495
              },
              {
                id: 5,
                name: '福建省',
                count: 0,
                rate: 396
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 396
              },
              {
                id: 32,
                name: '湖南省',
                count: 0,
                rate: 396
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 396
              }
            ],
            cities: [
              {
                id: 290,
                name: '北京市',
                count: 0,
                rate: 514
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 330
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 320
              },
              {
                id: 430,
                name: '上海市',
                count: 0,
                rate: 291
              },
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 278
              },
              {
                id: 279,
                name: '苏州市',
                count: 0,
                rate: 270
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 263
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 206
              },
              {
                id: 372,
                name: '重庆市',
                count: 0,
                rate: 195
              },
              {
                id: 55,
                name: '武汉市',
                count: 0,
                rate: 162
              }
            ]
          },
          {
            kolId: 5178,
            totalCount: 3924073,
            femaleRate: 6801,
            maleRate: 3199,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 2529
              },
              {
                k: '18-24',
                v: 0,
                r: 4573
              },
              {
                k: '25-29',
                v: 0,
                r: 2496
              },
              {
                k: '30-39',
                v: 0,
                r: 365
              },
              {
                k: '40-49',
                v: 0,
                r: 1
              },
              {
                k: '≥50',
                v: 0,
                r: 36
              }
            ],
            provinces: [
              {
                id: 24,
                name: '四川省',
                count: 0,
                rate: 860
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 442
              },
              {
                id: 5,
                name: '福建省',
                count: 0,
                rate: 348
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 331
              },
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 321
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 270
              },
              {
                id: 3,
                name: '湖北省',
                count: 0,
                rate: 237
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 237
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 232
              },
              {
                id: 26,
                name: '广西壮族自治区',
                count: 0,
                rate: 221
              }
            ],
            cities: [
              {
                id: 302,
                name: '成都市',
                count: 0,
                rate: 344
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 177
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 139
              },
              {
                id: 87,
                name: '厦门市',
                count: 0,
                rate: 132
              },
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 129
              },
              {
                id: 172,
                name: '合肥市',
                count: 0,
                rate: 108
              },
              {
                id: 55,
                name: '武汉市',
                count: 0,
                rate: 95
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 95
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 93
              },
              {
                id: 279,
                name: '苏州市',
                count: 0,
                rate: 88
              }
            ]
          },
          {
            kolId: 5203,
            totalCount: 3272488,
            femaleRate: 7553,
            maleRate: 2447,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 1652
              },
              {
                k: '18-24',
                v: 0,
                r: 4924
              },
              {
                k: '25-29',
                v: 0,
                r: 2091
              },
              {
                k: '30-39',
                v: 0,
                r: 1121
              },
              {
                k: '40-49',
                v: 0,
                r: 152
              },
              {
                k: '≥50',
                v: 0,
                r: 60
              }
            ],
            provinces: [
              {
                id: 2,
                name: '辽宁省',
                count: 0,
                rate: 809
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 642
              },
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 380
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 367
              },
              {
                id: 23,
                name: '北京市',
                count: 0,
                rate: 355
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 330
              },
              {
                id: 25,
                name: '黑龙江省',
                count: 0,
                rate: 255
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 238
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 232
              },
              {
                id: 31,
                name: '河北省',
                count: 0,
                rate: 231
              }
            ],
            cities: [
              {
                id: 37,
                name: '大连市',
                count: 0,
                rate: 486
              },
              {
                id: 412,
                name: '济南市',
                count: 0,
                rate: 385
              },
              {
                id: 354,
                name: '深圳市',
                count: 0,
                rate: 228
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 220
              },
              {
                id: 290,
                name: '北京市',
                count: 0,
                rate: 213
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 198
              },
              {
                id: 324,
                name: '哈尔滨市',
                count: 0,
                rate: 153
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 143
              },
              {
                id: 172,
                name: '合肥市',
                count: 0,
                rate: 139
              },
              {
                id: 374,
                name: '石家庄市',
                count: 0,
                rate: 138
              }
            ]
          },
          {
            kolId: 5937,
            totalCount: 11979291,
            femaleRate: 6683,
            maleRate: 3317,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 997
              },
              {
                k: '18-24',
                v: 0,
                r: 2815
              },
              {
                k: '25-29',
                v: 0,
                r: 2713
              },
              {
                k: '30-39',
                v: 0,
                r: 2491
              },
              {
                k: '40-49',
                v: 0,
                r: 646
              },
              {
                k: '≥50',
                v: 0,
                r: 338
              }
            ],
            provinces: [
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 930
              },
              {
                id: 23,
                name: '北京市',
                count: 0,
                rate: 514
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 485
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 441
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 387
              },
              {
                id: 36,
                name: '上海市',
                count: 0,
                rate: 338
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 303
              },
              {
                id: 24,
                name: '四川省',
                count: 0,
                rate: 287
              },
              {
                id: 31,
                name: '湖北省',
                count: 0,
                rate: 238
              },
              {
                id: 2,
                name: '辽宁省',
                count: 0,
                rate: 224
              }
            ],
            cities: [
              {
                id: 290,
                name: '北京市',
                count: 0,
                rate: 514
              },
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 500
              },
              {
                id: 354,
                name: '深圳市',
                count: 0,
                rate: 400
              },
              {
                id: 430,
                name: '上海市',
                count: 0,
                rate: 338
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 330
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 300
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 263
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 206
              },
              {
                id: 372,
                name: '重庆市',
                count: 0,
                rate: 195
              },
              {
                id: 55,
                name: '武汉市',
                count: 0,
                rate: 162
              }
            ]
          }
        ],
        channelCode: 'weibo'
      },
      {
        value: [
          {
            kolId: 3898,
            totalCount: 68630000,
            femaleRate: 8422,
            maleRate: 1578,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 5944
              },
              {
                k: '18-24',
                v: 0,
                r: 2874
              },
              {
                k: '25-29',
                v: 0,
                r: 718
              },
              {
                k: '30-39',
                v: 0,
                r: 406
              },
              {
                k: '40-49',
                v: 0,
                r: 12
              },
              {
                k: '≥50',
                v: 0,
                r: 46
              }
            ],
            provinces: [
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 718
              },
              {
                id: 24,
                name: '四川省',
                count: 0,
                rate: 533
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 368
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 347
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 334
              },
              {
                id: 32,
                name: '湖南省',
                count: 0,
                rate: 316
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 281
              },
              {
                id: 30,
                name: '重庆市',
                count: 0,
                rate: 272
              },
              {
                id: 5,
                name: '福建省',
                count: 0,
                rate: 245
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 233
              }
            ],
            cities: [
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 359
              },
              {
                id: 354,
                name: '深圳市',
                count: 0,
                rate: 323
              },
              {
                id: 302,
                name: '成都市',
                count: 0,
                rate: 320
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 221
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 208
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 200
              },
              {
                id: 387,
                name: '长沙市',
                count: 0,
                rate: 190
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 168
              },
              {
                id: 372,
                name: '重庆市',
                count: 0,
                rate: 163
              },
              {
                id: 87,
                name: '厦门市',
                count: 0,
                rate: 147
              }
            ]
          },
          {
            kolId: 5173,
            totalCount: 0,
            femaleRate: 6483,
            maleRate: 3517,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 1530
              },
              {
                k: '18-24',
                v: 0,
                r: 4295
              },
              {
                k: '25-29',
                v: 0,
                r: 2024
              },
              {
                k: '30-39',
                v: 0,
                r: 1274
              },
              {
                k: '40-49',
                v: 0,
                r: 497
              },
              {
                k: '≥50',
                v: 0,
                r: 380
              }
            ],
            provinces: [
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 693
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 693
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 594
              },
              {
                id: 7,
                name: '江西省',
                count: 0,
                rate: 495
              },
              {
                id: 2,
                name: '辽宁省',
                count: 0,
                rate: 495
              },
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 495
              },
              {
                id: 5,
                name: '福建省',
                count: 0,
                rate: 396
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 396
              },
              {
                id: 32,
                name: '湖南省',
                count: 0,
                rate: 396
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 396
              }
            ],
            cities: [
              {
                id: 290,
                name: '北京市',
                count: 0,
                rate: 514
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 330
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 320
              },
              {
                id: 430,
                name: '上海市',
                count: 0,
                rate: 291
              },
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 278
              },
              {
                id: 279,
                name: '苏州市',
                count: 0,
                rate: 270
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 263
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 206
              },
              {
                id: 372,
                name: '重庆市',
                count: 0,
                rate: 195
              },
              {
                id: 55,
                name: '武汉市',
                count: 0,
                rate: 162
              }
            ]
          },
          {
            kolId: 5203,
            totalCount: 7354000,
            femaleRate: 7553,
            maleRate: 2447,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 1652
              },
              {
                k: '18-24',
                v: 0,
                r: 4924
              },
              {
                k: '25-29',
                v: 0,
                r: 2091
              },
              {
                k: '30-39',
                v: 0,
                r: 1121
              },
              {
                k: '40-49',
                v: 0,
                r: 152
              },
              {
                k: '≥50',
                v: 0,
                r: 60
              }
            ],
            provinces: [
              {
                id: 2,
                name: '辽宁省',
                count: 0,
                rate: 809
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 642
              },
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 380
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 367
              },
              {
                id: 23,
                name: '北京市',
                count: 0,
                rate: 355
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 330
              },
              {
                id: 25,
                name: '黑龙江省',
                count: 0,
                rate: 255
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 238
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 232
              },
              {
                id: 31,
                name: '河北省',
                count: 0,
                rate: 231
              }
            ],
            cities: [
              {
                id: 37,
                name: '大连市',
                count: 0,
                rate: 486
              },
              {
                id: 412,
                name: '济南市',
                count: 0,
                rate: 385
              },
              {
                id: 354,
                name: '深圳市',
                count: 0,
                rate: 228
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 220
              },
              {
                id: 290,
                name: '北京市',
                count: 0,
                rate: 213
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 198
              },
              {
                id: 324,
                name: '哈尔滨市',
                count: 0,
                rate: 153
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 143
              },
              {
                id: 172,
                name: '合肥市',
                count: 0,
                rate: 139
              },
              {
                id: 374,
                name: '石家庄市',
                count: 0,
                rate: 138
              }
            ]
          },
          {
            kolId: 5937,
            totalCount: 0,
            femaleRate: 6683,
            maleRate: 3317,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 997
              },
              {
                k: '18-24',
                v: 0,
                r: 2815
              },
              {
                k: '25-29',
                v: 0,
                r: 2713
              },
              {
                k: '30-39',
                v: 0,
                r: 2491
              },
              {
                k: '40-49',
                v: 0,
                r: 646
              },
              {
                k: '≥50',
                v: 0,
                r: 338
              }
            ],
            provinces: [
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 930
              },
              {
                id: 23,
                name: '北京市',
                count: 0,
                rate: 514
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 485
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 441
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 387
              },
              {
                id: 36,
                name: '上海市',
                count: 0,
                rate: 338
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 303
              },
              {
                id: 24,
                name: '四川省',
                count: 0,
                rate: 287
              },
              {
                id: 31,
                name: '湖北省',
                count: 0,
                rate: 238
              },
              {
                id: 2,
                name: '辽宁省',
                count: 0,
                rate: 2
              }
            ],
            cities: [
              {
                id: 290,
                name: '北京市',
                count: 0,
                rate: 514
              },
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 500
              },
              {
                id: 354,
                name: '深圳市',
                count: 0,
                rate: 400
              },
              {
                id: 430,
                name: '上海市',
                count: 0,
                rate: 338
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 330
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 300
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 263
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 206
              },
              {
                id: 372,
                name: '重庆市',
                count: 0,
                rate: 195
              },
              {
                id: 55,
                name: '武汉市',
                count: 0,
                rate: 162
              }
            ]
          }
        ],
        channelCode: 'wechat'
      },
      {
        value: [
          {
            kolId: 3898,
            totalCount: 23551000,
            femaleRate: 8422,
            maleRate: 1578,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 5944
              },
              {
                k: '18-24',
                v: 0,
                r: 2874
              },
              {
                k: '25-29',
                v: 0,
                r: 718
              },
              {
                k: '30-39',
                v: 0,
                r: 406
              },
              {
                k: '40-49',
                v: 0,
                r: 12
              },
              {
                k: '≥50',
                v: 0,
                r: 46
              }
            ],
            provinces: [
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 718
              },
              {
                id: 24,
                name: '四川省',
                count: 0,
                rate: 533
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 368
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 347
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 334
              },
              {
                id: 32,
                name: '湖南省',
                count: 0,
                rate: 316
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 281
              },
              {
                id: 30,
                name: '重庆市',
                count: 0,
                rate: 272
              },
              {
                id: 5,
                name: '福建省',
                count: 0,
                rate: 245
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 233
              }
            ],
            cities: [
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 359
              },
              {
                id: 354,
                name: '深圳市',
                count: 0,
                rate: 323
              },
              {
                id: 302,
                name: '成都市',
                count: 0,
                rate: 320
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 221
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 208
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 200
              },
              {
                id: 387,
                name: '长沙市',
                count: 0,
                rate: 190
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 168
              },
              {
                id: 372,
                name: '重庆市',
                count: 0,
                rate: 163
              },
              {
                id: 87,
                name: '厦门市',
                count: 0,
                rate: 147
              }
            ]
          },
          {
            kolId: 5173,
            totalCount: 4539000,
            femaleRate: 6283,
            maleRate: 3717,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 1530
              },
              {
                k: '18-24',
                v: 0,
                r: 4295
              },
              {
                k: '25-29',
                v: 0,
                r: 2024
              },
              {
                k: '30-39',
                v: 0,
                r: 1274
              },
              {
                k: '40-49',
                v: 0,
                r: 497
              },
              {
                k: '≥50',
                v: 0,
                r: 380
              }
            ],
            provinces: [
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 693
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 693
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 594
              },
              {
                id: 7,
                name: '江西省',
                count: 0,
                rate: 495
              },
              {
                id: 2,
                name: '辽宁省',
                count: 0,
                rate: 495
              },
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 495
              },
              {
                id: 5,
                name: '福建省',
                count: 0,
                rate: 396
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 396
              },
              {
                id: 32,
                name: '湖南省',
                count: 0,
                rate: 396
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 396
              }
            ],
            cities: [
              {
                id: 290,
                name: '北京市',
                count: 0,
                rate: 514
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 330
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 320
              },
              {
                id: 430,
                name: '上海市',
                count: 0,
                rate: 291
              },
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 278
              },
              {
                id: 279,
                name: '苏州市',
                count: 0,
                rate: 270
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 263
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 206
              },
              {
                id: 372,
                name: '重庆市',
                count: 0,
                rate: 195
              },
              {
                id: 55,
                name: '武汉市',
                count: 0,
                rate: 162
              }
            ]
          },
          {
            kolId: 5178,
            totalCount: 2075000,
            femaleRate: 8601,
            maleRate: 1399,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 3029
              },
              {
                k: '18-24',
                v: 0,
                r: 5073
              },
              {
                k: '25-29',
                v: 0,
                r: 1496
              },
              {
                k: '30-39',
                v: 0,
                r: 365
              },
              {
                k: '40-49',
                v: 0,
                r: 1
              },
              {
                k: '≥50',
                v: 0,
                r: 36
              }
            ],
            provinces: [
              {
                id: 24,
                name: '四川省',
                count: 0,
                rate: 860
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 442
              },
              {
                id: 5,
                name: '福建省',
                count: 0,
                rate: 348
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 331
              },
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 321
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 270
              },
              {
                id: 3,
                name: '湖北省',
                count: 0,
                rate: 237
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 237
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 232
              },
              {
                id: 26,
                name: '广西壮族自治区',
                count: 0,
                rate: 221
              }
            ],
            cities: [
              {
                id: 302,
                name: '成都市',
                count: 0,
                rate: 344
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 177
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 139
              },
              {
                id: 87,
                name: '厦门市',
                count: 0,
                rate: 132
              },
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 129
              },
              {
                id: 172,
                name: '合肥市',
                count: 0,
                rate: 108
              },
              {
                id: 55,
                name: '武汉市',
                count: 0,
                rate: 95
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 95
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 93
              },
              {
                id: 279,
                name: '苏州市',
                count: 0,
                rate: 88
              }
            ]
          },
          {
            kolId: 5203,
            totalCount: 7354000,
            femaleRate: 7553,
            maleRate: 2447,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 1652
              },
              {
                k: '18-24',
                v: 0,
                r: 4924
              },
              {
                k: '25-29',
                v: 0,
                r: 2091
              },
              {
                k: '30-39',
                v: 0,
                r: 1121
              },
              {
                k: '40-49',
                v: 0,
                r: 152
              },
              {
                k: '≥50',
                v: 0,
                r: 60
              }
            ],
            provinces: [
              {
                id: 2,
                name: '辽宁省',
                count: 0,
                rate: 809
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 642
              },
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 380
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 367
              },
              {
                id: 23,
                name: '北京市',
                count: 0,
                rate: 355
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 330
              },
              {
                id: 25,
                name: '黑龙江省',
                count: 0,
                rate: 255
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 238
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 232
              },
              {
                id: 31,
                name: '河北省',
                count: 0,
                rate: 231
              }
            ],
            cities: [
              {
                id: 37,
                name: '大连市',
                count: 0,
                rate: 486
              },
              {
                id: 412,
                name: '济南市',
                count: 0,
                rate: 385
              },
              {
                id: 354,
                name: '深圳市',
                count: 0,
                rate: 228
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 220
              },
              {
                id: 290,
                name: '北京市',
                count: 0,
                rate: 213
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 198
              },
              {
                id: 324,
                name: '哈尔滨市',
                count: 0,
                rate: 153
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 143
              },
              {
                id: 172,
                name: '合肥市',
                count: 0,
                rate: 139
              },
              {
                id: 374,
                name: '石家庄市',
                count: 0,
                rate: 138
              }
            ]
          },
          {
            kolId: 5937,
            totalCount: 6732000,
            femaleRate: 6683,
            maleRate: 3317,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 997
              },
              {
                k: '18-24',
                v: 0,
                r: 2815
              },
              {
                k: '25-29',
                v: 0,
                r: 2713
              },
              {
                k: '30-39',
                v: 0,
                r: 2491
              },
              {
                k: '40-49',
                v: 0,
                r: 646
              },
              {
                k: '≥50',
                v: 0,
                r: 338
              }
            ],
            provinces: [
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 930
              },
              {
                id: 23,
                name: '北京市',
                count: 0,
                rate: 514
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 485
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 441
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 387
              },
              {
                id: 36,
                name: '上海市',
                count: 0,
                rate: 338
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 303
              },
              {
                id: 24,
                name: '四川省',
                count: 0,
                rate: 287
              },
              {
                id: 31,
                name: '湖北省',
                count: 0,
                rate: 238
              },
              {
                id: 2,
                name: '辽宁省',
                count: 0,
                rate: 224
              }
            ],
            cities: [
              {
                id: 290,
                name: '北京市',
                count: 0,
                rate: 514
              },
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 500
              },
              {
                id: 354,
                name: '深圳市',
                count: 0,
                rate: 400
              },
              {
                id: 430,
                name: '上海市',
                count: 0,
                rate: 338
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 330
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 300
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 263
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 206
              },
              {
                id: 372,
                name: '重庆市',
                count: 0,
                rate: 195
              },
              {
                id: 55,
                name: '武汉市',
                count: 0,
                rate: 162
              }
            ]
          }
        ],
        channelCode: 'douyin'
      },
      {
        value: [
          {
            kolId: 3898,
            totalCount: 3862000,
            femaleRate: 8422,
            maleRate: 1578,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 5944
              },
              {
                k: '18-24',
                v: 0,
                r: 2874
              },
              {
                k: '25-29',
                v: 0,
                r: 718
              },
              {
                k: '30-39',
                v: 0,
                r: 406
              },
              {
                k: '40-49',
                v: 0,
                r: 12
              },
              {
                k: '≥50',
                v: 0,
                r: 46
              }
            ],
            provinces: [
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 718
              },
              {
                id: 24,
                name: '四川省',
                count: 0,
                rate: 533
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 368
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 347
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 334
              },
              {
                id: 32,
                name: '湖南省',
                count: 0,
                rate: 316
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 281
              },
              {
                id: 30,
                name: '重庆市',
                count: 0,
                rate: 272
              },
              {
                id: 5,
                name: '福建省',
                count: 0,
                rate: 245
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 233
              }
            ],
            cities: [
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 359
              },
              {
                id: 354,
                name: '深圳市',
                count: 0,
                rate: 323
              },
              {
                id: 302,
                name: '成都市',
                count: 0,
                rate: 320
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 221
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 208
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 200
              },
              {
                id: 387,
                name: '长沙市',
                count: 0,
                rate: 190
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 168
              },
              {
                id: 372,
                name: '重庆市',
                count: 0,
                rate: 163
              },
              {
                id: 87,
                name: '厦门市',
                count: 0,
                rate: 147
              }
            ]
          },
          {
            kolId: 5173,
            totalCount: 1339000,
            femaleRate: 6083,
            maleRate: 3917,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 997
              },
              {
                k: '18-24',
                v: 0,
                r: 2815
              },
              {
                k: '25-29',
                v: 0,
                r: 2713
              },
              {
                k: '30-39',
                v: 0,
                r: 2491
              },
              {
                k: '40-49',
                v: 0,
                r: 646
              },
              {
                k: '≥50',
                v: 0,
                r: 338
              }
            ],
            provinces: [
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 693
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 693
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 594
              },
              {
                id: 7,
                name: '江西省',
                count: 0,
                rate: 495
              },
              {
                id: 2,
                name: '辽宁省',
                count: 0,
                rate: 495
              },
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 495
              },
              {
                id: 5,
                name: '福建省',
                count: 0,
                rate: 396
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 396
              },
              {
                id: 32,
                name: '湖南省',
                count: 0,
                rate: 396
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 396
              }
            ],
            cities: [
              {
                id: 290,
                name: '北京市',
                count: 0,
                rate: 514
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 330
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 320
              },
              {
                id: 430,
                name: '上海市',
                count: 0,
                rate: 291
              },
              {
                id: 353,
                name: '广州市',
                count: 0,
                rate: 278
              },
              {
                id: 279,
                name: '苏州市',
                count: 0,
                rate: 270
              },
              {
                id: 416,
                name: '青岛市',
                count: 0,
                rate: 263
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 206
              },
              {
                id: 372,
                name: '重庆市',
                count: 0,
                rate: 195
              },
              {
                id: 55,
                name: '武汉市',
                count: 0,
                rate: 162
              }
            ]
          },
          {
            kolId: 5203,
            totalCount: 557000,
            femaleRate: 7553,
            maleRate: 2447,
            ages: [
              {
                k: ' ≤17',
                v: 0,
                r: 1652
              },
              {
                k: '18-24',
                v: 0,
                r: 4924
              },
              {
                k: '25-29',
                v: 0,
                r: 2091
              },
              {
                k: '30-39',
                v: 0,
                r: 1121
              },
              {
                k: '40-49',
                v: 0,
                r: 152
              },
              {
                k: '≥50',
                v: 0,
                r: 60
              }
            ],
            provinces: [
              {
                id: 2,
                name: '辽宁省',
                count: 0,
                rate: 809
              },
              {
                id: 34,
                name: '山东省',
                count: 0,
                rate: 642
              },
              {
                id: 29,
                name: '广东省',
                count: 0,
                rate: 380
              },
              {
                id: 11,
                name: '浙江省',
                count: 0,
                rate: 367
              },
              {
                id: 23,
                name: '北京市',
                count: 0,
                rate: 355
              },
              {
                id: 21,
                name: '江苏省',
                count: 0,
                rate: 330
              },
              {
                id: 25,
                name: '黑龙江省',
                count: 0,
                rate: 255
              },
              {
                id: 8,
                name: '河南省',
                count: 0,
                rate: 238
              },
              {
                id: 14,
                name: '安徽省',
                count: 0,
                rate: 232
              },
              {
                id: 31,
                name: '河北省',
                count: 0,
                rate: 231
              }
            ],
            cities: [
              {
                id: 37,
                name: '大连市',
                count: 0,
                rate: 486
              },
              {
                id: 412,
                name: '济南市',
                count: 0,
                rate: 385
              },
              {
                id: 354,
                name: '深圳市',
                count: 0,
                rate: 228
              },
              {
                id: 138,
                name: '杭州市',
                count: 0,
                rate: 220
              },
              {
                id: 290,
                name: '北京市',
                count: 0,
                rate: 213
              },
              {
                id: 282,
                name: '南京市',
                count: 0,
                rate: 198
              },
              {
                id: 324,
                name: '哈尔滨市',
                count: 0,
                rate: 153
              },
              {
                id: 108,
                name: '郑州市',
                count: 0,
                rate: 143
              },
              {
                id: 172,
                name: '合肥市',
                count: 0,
                rate: 139
              },
              {
                id: 374,
                name: '石家庄市',
                count: 0,
                rate: 138
              }
            ]
          }
        ],
        channelCode: 'kuaishou'
      }
    ],
    brands: [
      {
        kolId: 3898,
        count: 2,
        top1: {
          k: 'PARTNER_BUSINESS_TECHNOLOGY',
          v: 1,
          r: 0
        },
        top2: {
          k: 'PARTNER_BUSINESS_DIGITAL',
          v: 1,
          r: 0
        },
        top3: null
      },
      {
        kolId: 5173,
        count: 3,
        top1: {
          k: 'PARTNER_BUSINESS_FOOD',
          v: 3,
          r: 0
        },
        top2: null,
        top3: null
      },
      {
        kolId: 5178,
        count: 5,
        top1: {
          k: 'PARTNER_BUSINESS_FOOD',
          v: 5,
          r: 0
        },
        top2: null,
        top3: null
      },
      {
        kolId: 5203,
        count: 3,
        top1: {
          k: 'PARTNER_BUSINESS_FOOD',
          v: 1,
          r: 0
        },
        top2: {
          k: 'PARTNER_BUSINESS_CAR',
          v: 1,
          r: 0
        },
        top3: {
          k: 'PARTNER_BUSINESS_ONLINE_SHOPPING',
          v: 1,
          r: 0
        }
      },
      {
        kolId: 5937,
        count: 3,
        top1: {
          k: 'PARTNER_BUSINESS_FOOD',
          v: 2,
          r: 0
        },
        top2: {
          k: 'PARTNER_BUSINESS_OTHER',
          v: 1,
          r: 0
        },
        top3: null
      }
    ],
    brandCategoryList: [
      {
        controlStatus: 1,
        text: '汽车用品',
        key: 'PARTNER_BUSINESS_CAR'
      },
      {
        controlStatus: 1,
        text: '电商平台',
        key: 'PARTNER_BUSINESS_ONLINE_SHOPPING'
      },
      {
        controlStatus: 1,
        text: '护肤彩妆',
        key: 'PARTNER_BUSINESS_SKINCARE'
      },
      {
        controlStatus: 1,
        text: '数码家电',
        key: 'PARTNER_BUSINESS_DIGITAL'
      },
      {
        controlStatus: 1,
        text: '服饰鞋帽',
        key: 'PARTNER_BUSINESS_CLOTHES'
      },
      {
        controlStatus: 1,
        text: 'IT业',
        key: 'PARTNER_BUSINESS_TECHNOLOGY'
      },
      {
        controlStatus: 1,
        text: '食品饮料',
        key: 'PARTNER_BUSINESS_FOOD'
      },
      {
        controlStatus: 1,
        text: '金融',
        key: 'PARTNER_BUSINESS_BANKING'
      },
      {
        controlStatus: 1,
        text: '珠宝钟表',
        key: 'PARTNER_BUSINESS_JEWELRY'
      },
      {
        controlStatus: 1,
        text: '餐饮',
        key: 'PARTNER_BUSINESS_RESTAURANT'
      },
      {
        controlStatus: 1,
        text: '日用百货',
        key: 'PARTNER_BUSINESS_DAILYUSE '
      },
      {
        controlStatus: 1,
        text: '家具建材',
        key: 'PARTNER_BUSINESS_FURNITURE'
      },
      {
        controlStatus: 1,
        text: '母婴用品',
        key: 'PARTNER_BUSINESS_MATERNAL'
      },
      {
        controlStatus: 1,
        text: '其他',
        key: 'PARTNER_BUSINESS_OTHER'
      }
    ],
    ageCategoryList: [
      {
        controlStatus: 1,
        text: '17岁及以下',
        key: '0-17'
      },
      {
        controlStatus: 1,
        text: '18-24',
        key: '18-24'
      },
      {
        controlStatus: 1,
        text: '25-29',
        key: '25-29'
      },
      {
        controlStatus: 1,
        text: '30-39',
        key: '30-39'
      },
      {
        controlStatus: 1,
        text: '40-49',
        key: '40-49'
      },
      {
        controlStatus: 1,
        text: '50+以上',
        key: '50+'
      }
    ]
  })
}

