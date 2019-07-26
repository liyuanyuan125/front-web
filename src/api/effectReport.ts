import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

// 分页查询三方检测列表
// 待整理
export async function thirdMonitors(query: any) {
    const res = await get('/xadvert/plans', query)
    return res
    return await mockGet(query, {
        items: [
            {
                id: 9,
                name: '测试',
                customerId: 1,
                customerName: '测试品牌',
                branbdId: 1,
                brandName: 'jja',
                productId: 2,
                productName: '测试产品',
                beginDate: 20190101,
                endDate: 20191001,
                deliveryMovies: [
                    {
                        movieId: 1,
                        movieName: '电影',
                        cycle: 100,
                        beginDate: 20190101,
                        endDate: 20191001
                    }
                ],
                deliveryCinemas: null
            },
            {
                id: 10,
                name: '测试',
                customerId: 1,
                customerName: '测试品牌',
                branbdId: 1,
                brandName: 'jja',
                productId: 2,
                productName: '测试产品',
                beginDate: 20190101,
                endDate: 20191001,
                deliveryMovies: [
                    {
                        movieId: 55077,
                        movieName: '电影',
                        cycle: 100,
                        beginDate: 20190101,
                        endDate: 20191001
                    }
                ],
                deliveryCinemas: null
            },
            {
                id: 11,
                name: '测试',
                customerId: 1,
                customerName: '奔驰',
                branbdId: 3,
                brandName: 'nisi',
                productId: 2,
                productName: 'tempor',
                beginDate: 20190101,
                endDate: 20190707,
                deliveryMovies: [
                    {
                        movieId: 51813,
                        movieName: '票',
                        cycle: 0,
                        beginDate: 20190101,
                        endDate: 20190701
                    }
                ],
                deliveryCinemas: null
            },
            {
                id: 39,
                name: '测试39',
                customerId: 1,
                customerName: '测试品牌',
                branbdId: 1,
                brandName: 'jja',
                productId: 2,
                productName: '测试产品',
                beginDate: 20190101,
                endDate: 20191001,
                deliveryMovies: [
                    {
                        movieId: 55077,
                        movieName: '电影',
                        cycle: 100,
                        beginDate: 20190101,
                        endDate: 20191001
                    }
                ],
                deliveryCinemas: null
            }
        ],
        totalCount: 4
    })
}

/**
 * 分页查询广告计划列表
 * https://yapi.aiads-dev.com/project/139/interface/api/2009
 */
export async function getPlans(query: any) {
    const res = await get('/xadvert/plans', query)
    return res
    return await mockGet(query, {
        'items|3': [
            {
                id: tid,
                companyId: tid,
                name: title20,
                specification: 30,
                videoId: tid,
                videoLogo: '//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bka7cktjqctg008ubkq0.png',
                videoName: '奔驰广告片',
                customerId: tid,
                brandId: tid,
                customerName: '奔驰客户',
                beginDate: 20190627,
                endDate: 20190703,
                cycle: 7,
                budgetAmount: 100000,
                cityCustom: 0,
                allNation: 1,
                deliveryCityTypes: null,
                cinemaCount: 0,
                cinemaGradeCodes: null,
                customDeliveryCities: null,
                deliveryGroups: [
                    {
                        tagTypeCode: 'MOVIE_TYPE',
                        text: 'Romance'
                    },
                    {
                        tagTypeCode: 'PLAN_GROUP_AGE',
                        text: '20-24year'
                    },
                    {
                        tagTypeCode: 'PLAN_GROUP_SEX',
                        text: 'woman'
                    }
                ],
                movieCustom: 0,
                deliveryMovies: null,
                status: 1,
                allowAutoDelivery: 0,
                applyUser: 1323,
                applyName: '看看账号联系人是否修改2',
                applyTime: '2019-06-25T17:14:26.217',
                approvalUser: 0,
                approvalName: null,
                approvalTime: null,
                estimateShowCount: 5320,
                estimatePersonCount: 198824,
                estimateCostAmount: 99852,
                settlementStatus: 0,
                settlementUser: 0,
                settlementName: null,
                settlementTime: null,
                payUser: 0,
                payName: null,
                payTime: null,
                freezeAmount: null,
                needPayAmount: null,
                recommend: true,
                refundAmount: null,
                settlementAmount: null
            },
        ],
        plan: {
            id: 39,
            name: '234gg',
            beginDate: 20190620,
            endDate: 20190626,
            cycle: 7,
            videoName: '广告片1',
            specification: 15,
            status: 'ONDRAFT'
        },
        report: {
            viewCount: 97200,
            scheduleCount: 6000,
            cost: 25148181792,
            dates: [
                {
                    date: 20190101,
                    viewCount: 32400,
                    scheduleCount: 2000,
                    cost: 8382727264
                },
                {
                    date: 20190102,
                    viewCount: 32400,
                    scheduleCount: 2000,
                    cost: 8382727264
                },
                {
                    date: 20190103,
                    viewCount: 32400,
                    scheduleCount: 2000,
                    cost: 8382727264
                }
            ],
            lastModifyTime: 1547178378340
        },
        movies: [
            {
                movieId: tid,
                name: title20,
                poster: 'http://img21.mtime.cn/mt/2012/02/17/102411.25247175_1280X720X2.jpg',
                release: 20120217,
                types: [
                    'Action',
                    'Thriller',
                    'Crime'
                ],
                score: 7,
                userPortrait: {
                    male: 30,
                    female: 70,
                    ages: [
                        {
                            key: '0~20岁',
                            value: 50
                        },
                        {
                            key: '20~50岁',
                            value: 30
                        }
                    ]
                },
                viewCount: 32400,
                viewRate: '33.33',
                scheduleCount: 2000
            }
        ],
        cinemas: [
            {
                cinemaId: 10000,
                name: '四川省宜宾市宜宾县华富国际4K巨幕影城',
                viewRate: '33.33',
                scheduleRate: '33.33',
                costRate: '33.33'
            },
            {
                cinemaId: 10001,
                name: '河南省许昌市万达影院',
                viewRate: '33.33',
                scheduleRate: '33.33',
                costRate: '33.33'
            },
            {
                cinemaId: 10011,
                name: '江苏泰兴星轶联和影城',
                viewRate: '33.33',
                scheduleRate: '33.33',
                costRate: '33.33'
            }
        ],
        user: {
            male: '55',
            female: '45',
            ages: [
                {
                    v: '30',
                    k: '30岁以下'
                },
                {
                    v: '70',
                    k: '30岁以上'
                }
            ],
            cities: [
                {
                    v: '10',
                    k: '北京'
                },
                {
                    v: '10',
                    k: '北京'
                }
            ],
            grades: [
                {
                    v: '30',
                    k: 'first-tier'
                },
                {
                    v: '40',
                    k: 'second-tier'
                }
            ]
        },
        gradeCodes: [
            {
                text: '新一线城市',
                key: 'new-first-tier'
            },
            {
                text: '一线城市',
                key: 'first-tier'
            },
            {
                text: '二线城市',
                key: 'second-tier'
            },
            {
                text: '三线城市',
                key: 'third-tier'
            },
            {
                text: '四线城市',
                key: 'four-tier'
            },
            {
                text: '五线城市',
                key: 'five-tier'
            }
        ],
        planStatus: [
            {
                text: '未知',
                key: 'UNKNOWN'
            },
            {
                text: '草稿',
                key: 'ONDRAFT'
            },
            {
                text: '待审核',
                key: 'UNAPPROVE'
            },
            {
                text: '待确认',
                key: 'UNCONFIRM'
            },
            {
                text: '待支付',
                key: 'UNPAY'
            },
            {
                text: '已支付',
                key: 'BEPAY'
            },
            {
                text: '接单中',
                key: 'BEORDER'
            },
            {
                text: '待执行',
                key: 'UNEXECUTE'
            },
            {
                text: '执行中',
                key: 'ONEXECUTE'
            },
            {
                text: '待结算',
                key: 'UNSETTLEMENT'
            },
            {
                text: '结算中',
                key: 'SETTLEMENT'
            },
            {
                text: '已完成',
                key: 'FINISH'
            },
            {
                text: '已失效',
                key: 'INVALID'
            }
        ],
        movieTypes: [
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

/**
 * 分页获取影院的效果报表
 * @param id id
 * https://yapi.aiads-dev.com/project/139/interface/api/4740
 */

export async function cinemasReport(id: string = '', query: any = {}) {
    const res = await get(`xadvert/plans/${id}/report/cinemas`, query)
    return res
    return await mockGet(id, {
        items: null,
        totalCount: null
    })
}

/**
 * 分页获取城市的效果报表
 * @param id id
 * @param query query
 * https://yapi.aiads-dev.com/project/139/interface/api/4749
 */
export async function citiesReport(id: string = '', query: any = {}) {
    const res = await get(`xadvert/plans/${id}/report/cities`, query)
    return res
    return await mockGet(id, {
        items: null,
        totalCount: null
    })
}

/**
 * 模糊搜索客户
 * @param data
 * http://yapi.aiads-dev.com/project/94/interface/api/785
 */
export async function searchPartners(data: any) {
    const res = await get('/customer/partners', data)
    return res
    return await mockGet(data, {
        businessList: [
            {
                code: 'PARTNER_BUSINESS_CAR',
                desc: '汽车用品'
            },
            {
                code: 'PARTNER_BUSINESS_ONLINE_SHOPPING',
                desc: '电商平台'
            },
            {
                code: 'PARTNER_BUSINESS_SKINCARE',
                desc: '护肤彩妆'
            },
            {
                code: 'PARTNER_BUSINESS_DIGITAL',
                desc: '数码家电'
            },
            {
                code: 'PARTNER_BUSINESS_CLOTHES',
                desc: '服饰鞋帽'
            },
            {
                code: 'PARTNER_BUSINESS_TECHNOLOGY',
                desc: 'IT业'
            },
            {
                code: 'PARTNER_BUSINESS_FOOD',
                desc: '食品饮料'
            },
            {
                code: 'PARTNER_BUSINESS_BANKING',
                desc: '金融'
            },
            {
                code: 'PARTNER_BUSINESS_JEWELRY',
                desc: '珠宝钟表'
            },
            {
                code: 'PARTNER_BUSINESS_RESTAURANT',
                desc: '餐饮'
            },
            {
                code: 'PARTNER_BUSINESS_DAILYUSE ',
                desc: '日用百货'
            },
            {
                code: 'PARTNER_BUSINESS_FURNITURE',
                desc: '家具建材'
            },
            {
                code: 'PARTNER_BUSINESS_MATERNAL',
                desc: '母婴用品'
            },
            {
                code: 'PARTNER_BUSINESS_OTHER',
                desc: '其他'
            }
        ],
        items: [
            {
                id: 1,
                name: '奔驰1',
                nameShort: '奔驰1',
                businessCode: 'PARTNER_BUSINESS_CAR',
                businessName: '汽车用品',
                businessCategoryCode: 'CAR',
                businessCategoryName: '汽车',
                contactName: '联系人',
                contactTel: '18521112231',
                contactAddress: '北京朝阳'
            },
            {
                id: 2,
                name: '奔驰2',
                nameShort: '奔驰2',
                businessCode: 'PARTNER_BUSINESS_CAR',
                businessName: '汽车用品',
                businessCategoryCode: 'CAR',
                businessCategoryName: '汽车',
                contactName: '联系人',
                contactTel: '18521112231',
                contactAddress: '北京朝阳'
            },
            {
                id: 3,
                name: '奔驰3',
                nameShort: '奔驰3',
                businessCode: 'PARTNER_BUSINESS_CAR',
                businessName: '汽车用品',
                businessCategoryCode: 'CAR',
                businessCategoryName: '汽车',
                contactName: '联系人',
                contactTel: '18521112231',
                contactAddress: '北京朝阳'
            },
            {
                id: 4,
                name: '奔驰4',
                nameShort: '奔驰4',
                businessCode: 'PARTNER_BUSINESS_CAR',
                businessName: '汽车用品',
                businessCategoryCode: 'CAR',
                businessCategoryName: '汽车',
                contactName: '联系人',
                contactTel: '18521112231',
                contactAddress: '北京朝阳'
            },
            {
                id: 5,
                name: '奔驰5',
                nameShort: '奔驰5',
                businessCode: 'PARTNER_BUSINESS_CAR',
                businessName: '汽车用品',
                businessCategoryCode: 'CAR',
                businessCategoryName: '汽车',
                contactName: '联系人',
                contactTel: '18521112231',
                contactAddress: '北京朝阳'
            },
            {
                id: 6,
                name: '奔驰6',
                nameShort: '奔驰6',
                businessCode: 'PARTNER_BUSINESS_CAR',
                businessName: '汽车用品',
                businessCategoryCode: 'CAR',
                businessCategoryName: '汽车',
                contactName: '联系人',
                contactTel: '18521112231',
                contactAddress: '北京朝阳'
            }
        ],
        companyId: 120,
        totalCount: 246
    })
}

/**
 * 计划列表 v1
 * @param data
 * https://yapi.aiads-dev.com/project/139/interface/api/2009
 */
export async function searchPlans(data: any) {
    data.statusList = '6,7,8,9'
    const res = await get('/xadvert/plans', data)
    return res
    return await mockGet(data, {
        items: [
            {
                id: 256,
                companyId: 120,
                name: '[ 奔驰广告片 ] [ 奔驰客户 ] [ 奔驰G级 ]',
                specification: 30,
                videoId: 298,
                videoLogo: '//aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bka7cktjqctg008ubkq0.png',
                videoName: '奔驰广告片',
                customerId: 1051,
                brandId: 10121,
                customerName: '奔驰客户',
                beginDate: 20190627,
                endDate: 20190703,
                cycle: 7,
                budgetAmount: 100000,
                cityCustom: 0,
                allNation: 1,
                deliveryCityTypes: null,
                cinemaCount: 0,
                cinemaGradeCodes: null,
                customDeliveryCities: null,
                deliveryGroups: [
                    {
                        tagTypeCode: 'MOVIE_TYPE',
                        text: 'Romance'
                    },
                    {
                        tagTypeCode: 'PLAN_GROUP_AGE',
                        text: '20-24year'
                    },
                    {
                        tagTypeCode: 'PLAN_GROUP_SEX',
                        text: 'woman'
                    }
                ],
                movieCustom: 0,
                deliveryMovies: null,
                status: 1,
                allowAutoDelivery: 0,
                applyUser: 1323,
                applyName: '看看账号联系人是否修改2',
                applyTime: '2019-06-25T17:14:26.217',
                approvalUser: 0,
                approvalName: null,
                approvalTime: null,
                estimateShowCount: 5320,
                estimatePersonCount: 198824,
                estimateCostAmount: 99852,
                settlementStatus: 0,
                settlementUser: 0,
                settlementName: null,
                settlementTime: null,
                payUser: 0,
                payName: null,
                payTime: null,
                freezeAmount: null,
                needPayAmount: null,
                recommend: true,
                refundAmount: null,
                settlementAmount: null
            },
        ],
        totalCount: 27,
        statusList: [
            {
                text: '未知',
                key: 0
            },
            {
                text: '草稿',
                key: 1
            },
            {
                text: '待审核',
                key: 2
            },
            {
                text: '待确认',
                key: 3
            },
            {
                text: '待支付',
                key: 4
            },
            {
                text: '已支付',
                key: 5
            },
            {
                text: '接单中',
                key: 6
            },
            {
                text: '待执行',
                key: 7
            },
            {
                text: '执行中',
                key: 8
            },
            {
                text: '待结算',
                key: 9
            },
            {
                text: '结算中',
                key: 10
            },
            {
                text: '已完成',
                key: 11
            },
            {
                text: '已失效',
                key: 12
            }
        ],
        settlementStatusList: [
            {
                text: '未知',
                key: 0
            },
            {
                text: '结算中',
                key: 1
            },
            {
                text: '已结算',
                key: 2
            },
            {
                text: '待结算',
                key: 3
            }
        ],
        tags: [
            {
                name: '电影类型',
                code: 'MOVIE_TYPE',
                values: [
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
                ]
            },
            {
                name: '年龄',
                code: 'PLAN_GROUP_AGE',
                values: [
                    {
                        controlStatus: 1,
                        text: '20岁以下',
                        key: '20year'
                    },
                    {
                        controlStatus: 1,
                        text: '20-24岁',
                        key: '20-24year'
                    },
                    {
                        controlStatus: 1,
                        text: '30-34岁',
                        key: '30-34year'
                    },
                    {
                        controlStatus: 1,
                        text: '25-29岁',
                        key: '25-29year'
                    },
                    {
                        controlStatus: 1,
                        text: '35-39岁',
                        key: '35-39year'
                    },
                    {
                        controlStatus: 1,
                        text: '40岁以上',
                        key: '40year'
                    }
                ]
            },
            {
                name: '性别',
                code: 'PLAN_GROUP_SEX',
                values: [
                    {
                        controlStatus: 1,
                        text: '未知',
                        key: 'unknow'
                    },
                    {
                        controlStatus: 1,
                        text: '男',
                        key: 'man'
                    },
                    {
                        controlStatus: 1,
                        text: '女',
                        key: 'woman'
                    }
                ]
            }
        ],
        cinemaGradeList: [
            {
                controlStatus: 1,
                text: '四星级',
                key: 'four'
            },
            {
                controlStatus: 1,
                text: '五星级',
                key: 'five'
            },
            {
                controlStatus: 1,
                text: '三星级',
                key: 'three'
            },
            {
                controlStatus: 1,
                text: '二星级',
                key: 'two'
            },
            {
                controlStatus: 1,
                text: '一星级',
                key: 'one'
            }
        ],
        deliveryCityTypeList: [
            {
                text: '票仓城市Top10',
                key: 'top20'
            },
            {
                text: '新一线城市',
                key: 'new-first-tier'
            },
            {
                text: '一线城市',
                key: 'first-tier'
            },
            {
                text: '二线城市',
                key: 'second-tier'
            },
            {
                text: '三线城市',
                key: 'third-tier'
            },
            {
                text: '四线城市',
                key: 'four-tier'
            },
            {
                text: '五线城市',
                key: 'five-tier'
            }
        ]
    })
}

/**
 * 广告计划效果报表
 * 当无法指定广告计划id时（入口在菜单栏），参数id传-1  表示按照产品的规则，显示一个默认的广告计划报表
 * https://yapi.aiads-dev.com/project/139/interface/api/4731
 * @param id
 */
export async function getPlansReport(id: number | string = -1) {
    // 演示 临时参数 nxd 20190621
    // id = '173'
    const res = await get(`xadvert/plans/${id}/report`)
    return res
    return await mockGet(id, {
        plan: {
            id: 39,
            name: '234gg',
            beginDate: 20190620,
            endDate: 20190626,
            cycle: 7,
            videoName: '广告片1',
            specification: 15,
            status: 'ONDRAFT'
        },
        report: {
            viewCount: 97200,
            scheduleCount: 6000,
            cost: 25148181792,
            dates: [{
                date: 20190101,
                viewCount: 32400,
                scheduleCount: 2000,
                cost: 8382727264
            },
            {
                date: 20190102,
                viewCount: 22400,
                scheduleCount: 3000,
                cost: 6382727264
            },
            {
                date: 20190103,
                viewCount: 12400,
                scheduleCount: 1000,
                cost: 5382727264
            }
            ],
            lastModifyTime: 1547178378340
        },
        'movies|12': [{
            movieId: tid,
            name: title20,
            poster: 'http://img21.mtime.cn/mt/2012/02/17/102411.25247175_1280X720X2.jpg',
            release: 20120217,
            types: [
                'Kids',
                'Thriller'
            ],
            score: 10,
            userPortrait: {
                male: 1,
                female: 22,
                ages: [
                    {
                        value: '10',
                        key: '0～20'
                    },
                    {
                        value: '10',
                        key: '20～24'
                    },
                    {
                        value: '20',
                        key: '25～29'
                    },
                    {
                        value: '30',
                        key: '30～34'
                    },
                    {
                        value: '20',
                        key: '35～39'
                    },
                    {
                        value: '10',
                        key: '40＋'
                    }
                ]
            },
            viewCount: 32400,
            viewRate: '33.33',
            scheduleCount: 2000
        }
        ],
        'cinemas|3': [{
            cinemaId: tid,
            name: title20,
            viewRate: tid,
            scheduleRate: tid,
            costRate: tid
        }
        ],
        user: {
            male: '55',
            female: '45',
            ages: [{
                v: '30',
                k: '30岁以下'
            },
            {
                v: '70',
                k: '30岁以上'
            }
            ],
            cities: [{
                v: '10',
                k: '北京'
            },
            {
                v: '101',
                k: '上海'
            }
            ],
            grades: [{
                v: '30',
                k: 'first-tier'
            },
            {
                v: '40',
                k: 'second-tier'
            }
            ]
        },
        gradeCodes: [
            {
                text: '新一线城市',
                key: 'new-first-tier'
            },
            {
                text: '一线城市',
                key: 'first-tier'
            },
            {
                text: '二线城市',
                key: 'second-tier'
            },
            {
                text: '三线城市',
                key: 'third-tier'
            },
            {
                text: '四线城市',
                key: 'four-tier'
            },
            {
                text: '五线城市',
                key: 'five-tier'
            }
        ],
        planStatus: [
            {
                text: '未知',
                key: 'UNKNOWN'
            },
            {
                text: '草稿',
                key: 'ONDRAFT'
            },
            {
                text: '待审核',
                key: 'UNAPPROVE'
            },
            {
                text: '待确认',
                key: 'UNCONFIRM'
            },
            {
                text: '待支付',
                key: 'UNPAY'
            },
            {
                text: '已支付',
                key: 'BEPAY'
            },
            {
                text: '接单中',
                key: 'BEORDER'
            },
            {
                text: '待执行',
                key: 'UNEXECUTE'
            },
            {
                text: '执行中',
                key: 'ONEXECUTE'
            },
            {
                text: '待结算',
                key: 'UNSETTLEMENT'
            },
            {
                text: '结算中',
                key: 'SETTLEMENT'
            },
            {
                text: '已完成',
                key: 'FINISH'
            },
            {
                text: '已失效',
                key: 'INVALID'
            }
        ],
        movieTypes: [
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
