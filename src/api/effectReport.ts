import { get, post, put } from '@/fn/ajax'
import { mockGet, typeTitle, tid, title20, dateRange } from './mock'

// 分页查询三方检测列表
export async function thirdMonitors(query: any) {
    const res = await get('/xadvert/v1/plans', query)
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

    return await mockGet(query, {
        items: [{
            id: 55077,
            nameCn: '唐人街探案3',
            releaseDate: 20200125,
            type: ['剧情', '动作'],
            director: ['导演1', '导演2'],
            actor: ['演员1', '演员2'],
            wish: 88655,
            image: null
        },
        {
            id: 55078,
            nameCn: '囧妈',
            releaseDate: 20200125,
            type: ['剧情', '喜剧'],
            director: ['导演1', '导演2'],
            actor: ['演员1', '演员2'],
            wish: 6985,
            image: null
        },
        {
            id: 55165,
            nameCn: '中国女排',
            releaseDate: 20200125,
            type: ['剧情', '运动'],
            director: ['导演1', '导演2'],
            actor: ['演员1', '演员2'],
            wish: 3691,
            image: null
        },
        {
            id: 55076,
            nameCn: '摸金校尉之九幽将军',
            releaseDate: 20191001,
            type: ['动作', '奇幻'],
            director: ['导演1', '导演2'],
            actor: ['演员1', '演员2'],
            wish: 248425,
            image: null
        }],
        totalCount: 20
    })
}

/**
 * 分页查询广告计划列表
 * https://yapi.aiads-dev.com/project/139/interface/api/2009
 */
export async function plans(query: any) {
    // const res = await get('/xadvert/v1/plans', query)
    // return res
    return await mockGet(query, {
        items: [{
            id: 49,
            companyId: 95,
            name: '陈鹏宇的测试公司',
            specification: 15,
            videoId: 273,
            videoLogo: 'http://img0.imgtn.bdimg.com/it/u=2387750928,3991855324&fm=26&gp=0.jpg',
            videoName: '广告片1',
            customerId: 15,
            brandId: 3,
            customerName: '奔驰',
            beginDate: 20190613,
            endDate: 20190619,
            cycle: 7,
            budgetAmount: 1334,
            cityCustom: 0,
            allNation: 0,
            deliveryCityTypes: null,
            cinemaCount: 0,
            cinemaGradeCodes: null,
            customDeliveryCities: null,
            deliveryGroups: null,
            movieCustom: 0,
            deliveryMovies: null,
            status: 4,
            allowAutoDelivery: 0,
            applyUser: 1293,
            applyName: 'vv',
            applyTime: '2019-06-11T09:43:39.529',
            approvalUser: 4,
            approvalName: '1admin',
            approvalTime: '2019-06-11T20:56:16.651',
            estimateShowCount: 0,
            estimatePersonCount: 0,
            estimateCostAmount: null,
            settlementStatus: 0,
            settlementUser: 0,
            settlementName: null,
            settlementTime: null,
            payUser: 0,
            payName: null,
            payTime: null,
            freezeAmount: null,
            needPayAmount: null,
            recommend: false,
            refundAmount: null,
            settlementAmount: null
        },
        {
            id: 54,
            companyId: 120,
            name: '111',
            specification: 15,
            videoId: 273,
            videoLogo: 'http://img0.imgtn.bdimg.com/it/u=2387750928,3991855324&fm=26&gp=0.jpg',
            videoName: '广告片1',
            customerId: 12,
            brandId: 4,
            customerName: '品牌2',
            beginDate: 20190620,
            endDate: 20190626,
            cycle: 7,
            budgetAmount: 100,
            cityCustom: 0,
            allNation: 0,
            deliveryCityTypes: null,
            cinemaCount: 0,
            cinemaGradeCodes: null,
            customDeliveryCities: null,
            deliveryGroups: null,
            movieCustom: 0,
            deliveryMovies: null,
            status: 4,
            allowAutoDelivery: 0,
            applyUser: 1323,
            applyName: '看看账号联系人是否修改2',
            applyTime: '2019-06-11T14:29:54.405',
            approvalUser: 0,
            approvalName: null,
            approvalTime: null,
            estimateShowCount: 0,
            estimatePersonCount: 0,
            estimateCostAmount: null,
            settlementStatus: 0,
            settlementUser: 0,
            settlementName: null,
            settlementTime: null,
            payUser: 0,
            payName: null,
            payTime: null,
            freezeAmount: null,
            needPayAmount: null,
            recommend: false,
            refundAmount: null,
            settlementAmount: null
        },
        {
            id: 60,
            companyId: 95,
            name: '雨',
            specification: 15,
            videoId: 273,
            videoLogo: 'http://img0.imgtn.bdimg.com/it/u=2387750928,3991855324&fm=26&gp=0.jpg',
            videoName: '广告片1',
            customerId: 15,
            brandId: 3,
            customerName: '奔驰',
            beginDate: 20190613,
            endDate: 20190619,
            cycle: 7,
            budgetAmount: 234,
            cityCustom: 0,
            allNation: 1,
            deliveryCityTypes: null,
            cinemaCount: 0,
            cinemaGradeCodes: null,
            customDeliveryCities: null,
            deliveryGroups: null,
            movieCustom: 0,
            deliveryMovies: null,
            status: 1,
            allowAutoDelivery: 0,
            applyUser: 1293,
            applyName: 'vv',
            applyTime: '2019-06-15T13:39:09.327',
            approvalUser: 0,
            approvalName: null,
            approvalTime: null,
            estimateShowCount: 6861,
            estimatePersonCount: 75862,
            estimateCostAmount: 0,
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
        {
            id: 62,
            companyId: 95,
            name: '你好啊',
            specification: 15,
            videoId: 273,
            videoLogo: 'http://img0.imgtn.bdimg.com/it/u=2387750928,3991855324&fm=26&gp=0.jpg',
            videoName: '广告片1',
            customerId: 15,
            brandId: 3,
            customerName: '奔驰',
            beginDate: 20190606,
            endDate: 20190612,
            cycle: 7,
            budgetAmount: 234,
            cityCustom: 0,
            allNation: 0,
            deliveryCityTypes: null,
            cinemaCount: 0,
            cinemaGradeCodes: null,
            customDeliveryCities: null,
            deliveryGroups: null,
            movieCustom: 0,
            deliveryMovies: null,
            status: 8,
            allowAutoDelivery: 0,
            applyUser: 1293,
            applyName: 'vv',
            applyTime: '2019-06-11T20:08:20.924',
            approvalUser: 0,
            approvalName: null,
            approvalTime: null,
            estimateShowCount: 0,
            estimatePersonCount: 0,
            estimateCostAmount: null,
            settlementStatus: 0,
            settlementUser: 0,
            settlementName: null,
            settlementTime: null,
            payUser: 0,
            payName: null,
            payTime: null,
            freezeAmount: null,
            needPayAmount: null,
            recommend: false,
            refundAmount: null,
            settlementAmount: null
        },
        {
            id: 63,
            companyId: 95,
            name: 'nihao',
            specification: 15,
            videoId: 273,
            videoLogo: 'http://img0.imgtn.bdimg.com/it/u=2387750928,3991855324&fm=26&gp=0.jpg',
            videoName: '广告片1',
            customerId: 15,
            brandId: 3,
            customerName: '奔驰',
            beginDate: 20190613,
            endDate: 20190619,
            cycle: 7,
            budgetAmount: 1234,
            cityCustom: 0,
            allNation: 0,
            deliveryCityTypes: null,
            cinemaCount: 0,
            cinemaGradeCodes: null,
            customDeliveryCities: null,
            deliveryGroups: null,
            movieCustom: 0,
            deliveryMovies: null,
            status: 8,
            allowAutoDelivery: 0,
            applyUser: 1293,
            applyName: 'vv',
            applyTime: '2019-06-12T14:11:55.204',
            approvalUser: 0,
            approvalName: null,
            approvalTime: null,
            estimateShowCount: 0,
            estimatePersonCount: 0,
            estimateCostAmount: null,
            settlementStatus: 0,
            settlementUser: 0,
            settlementName: null,
            settlementTime: null,
            payUser: 0,
            payName: null,
            payTime: null,
            freezeAmount: null,
            needPayAmount: null,
            recommend: false,
            refundAmount: null,
            settlementAmount: null
        },
        {
            id: 64,
            companyId: 120,
            name: '1',
            specification: 30,
            videoId: 284,
            videoLogo: 'http://img0.imgtn.bdimg.com/it/u=2387750928,3991855324&fm=26&gp=0.jpg',
            videoName: '0601修改广告片',
            customerId: 12,
            brandId: 4,
            customerName: '品牌2',
            beginDate: 20190620,
            endDate: 20190626,
            cycle: 7,
            budgetAmount: 10,
            cityCustom: 0,
            allNation: 0,
            deliveryCityTypes: null,
            cinemaCount: 0,
            cinemaGradeCodes: null,
            customDeliveryCities: null,
            deliveryGroups: null,
            movieCustom: 0,
            deliveryMovies: null,
            status: 1,
            allowAutoDelivery: 0,
            applyUser: 1323,
            applyName: '看看账号联系人是否修改2',
            applyTime: '2019-06-12T14:34:37.337',
            approvalUser: 0,
            approvalName: null,
            approvalTime: null,
            estimateShowCount: 0,
            estimatePersonCount: 0,
            estimateCostAmount: null,
            settlementStatus: 0,
            settlementUser: 0,
            settlementName: null,
            settlementTime: null,
            payUser: 0,
            payName: null,
            payTime: null,
            freezeAmount: null,
            needPayAmount: null,
            recommend: false,
            refundAmount: null,
            settlementAmount: null
        },
        {
            id: 65,
            companyId: 120,
            name: '订单',
            specification: 30,
            videoId: 284,
            videoLogo: 'http://img0.imgtn.bdimg.com/it/u=2387750928,3991855324&fm=26&gp=0.jpg',
            videoName: '0601修改广告片',
            customerId: 12,
            brandId: 4,
            customerName: '品牌2',
            beginDate: 20190711,
            endDate: 20190717,
            cycle: 7,
            budgetAmount: 457789,
            cityCustom: 0,
            allNation: 0,
            deliveryCityTypes: null,
            cinemaCount: 0,
            cinemaGradeCodes: null,
            customDeliveryCities: null,
            deliveryGroups: null,
            movieCustom: 0,
            deliveryMovies: null,
            status: 1,
            allowAutoDelivery: 0,
            applyUser: 1323,
            applyName: '看看账号联系人是否修改2',
            applyTime: '2019-06-12T15:28:17.723',
            approvalUser: 0,
            approvalName: null,
            approvalTime: null,
            estimateShowCount: 0,
            estimatePersonCount: 0,
            estimateCostAmount: null,
            settlementStatus: 0,
            settlementUser: 0,
            settlementName: null,
            settlementTime: null,
            payUser: 0,
            payName: null,
            payTime: null,
            freezeAmount: null,
            needPayAmount: null,
            recommend: false,
            refundAmount: null,
            settlementAmount: null
        },
        {
            id: 66,
            companyId: 95,
            name: '陈鹏宇的测试公司',
            specification: 15,
            videoId: 273,
            videoLogo: 'http://img0.imgtn.bdimg.com/it/u=2387750928,3991855324&fm=26&gp=0.jpg',
            videoName: '广告片1',
            customerId: 15,
            brandId: 3,
            customerName: '奔驰',
            beginDate: 20190613,
            endDate: 20190619,
            cycle: 7,
            budgetAmount: 1334,
            cityCustom: 0,
            allNation: 0,
            deliveryCityTypes: null,
            cinemaCount: 0,
            cinemaGradeCodes: null,
            customDeliveryCities: null,
            deliveryGroups: null,
            movieCustom: 0,
            deliveryMovies: null,
            status: 1,
            allowAutoDelivery: 0,
            applyUser: 1293,
            applyName: 'vv',
            applyTime: '2019-06-12T16:05:56.601',
            approvalUser: 0,
            approvalName: null,
            approvalTime: null,
            estimateShowCount: 0,
            estimatePersonCount: 0,
            estimateCostAmount: null,
            settlementStatus: 0,
            settlementUser: 0,
            settlementName: null,
            settlementTime: null,
            payUser: 0,
            payName: null,
            payTime: null,
            freezeAmount: null,
            needPayAmount: null,
            recommend: false,
            refundAmount: null,
            settlementAmount: null
        }],
        totalCount: 46,
        statusList: [{
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
        }],
        settlementStatusList: [{
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
        }],
        tags: [{
            name: '电影类型',
            code: 'MOVIE_TYPE',
            values: [{
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
            }]
        },
        {
            name: '年龄',
            code: 'PLAN_GROUP_AGE',
            values: [{
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
            }]
        },
        {
            name: '性别',
            code: 'PLAN_GROUP_SEX',
            values: [{
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
            }]
        }],
        cinemaGradeList: [{
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
        }],
        deliveryCityTypeList: [{
            text: '票仓城市Top20',
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
            text: '无线城市',
            key: 'five-tier'
        }]
    })

    return await mockGet(query, {
        items: [{
            id: 55077,
            nameCn: '唐人街探案3',
            releaseDate: 20200125,
            type: ['剧情', '动作'],
            director: ['导演1', '导演2'],
            actor: ['演员1', '演员2'],
            wish: 88655,
            image: null
        },
        {
            id: 55078,
            nameCn: '囧妈',
            releaseDate: 20200125,
            type: ['剧情', '喜剧'],
            director: ['导演1', '导演2'],
            actor: ['演员1', '演员2'],
            wish: 6985,
            image: null
        },
        {
            id: 55165,
            nameCn: '中国女排',
            releaseDate: 20200125,
            type: ['剧情', '运动'],
            director: ['导演1', '导演2'],
            actor: ['演员1', '演员2'],
            wish: 3691,
            image: null
        },
        {
            id: 55076,
            nameCn: '摸金校尉之九幽将军',
            releaseDate: 20191001,
            type: ['动作', '奇幻'],
            director: ['导演1', '导演2'],
            actor: ['演员1', '演员2'],
            wish: 248425,
            image: null
        }],
        totalCount: 20
    })
}

/**
 * 客户
 * @param data
 */
export async function popPartners(data: any) {
    // const res = await get('/customer/partners', data)
    // return res

    return await mockGet(data, {
        businessList: [
            {
                code: 'PARTNER_BUSINESS_CAR',
                desc: '汽车'
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
                code: 'PARTNER_BUSINESS_FOOD',
                desc: '食品'
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
        'items|15': [
            {
                id: tid,
                name: title20,
                nameShort: '客户简称',
                businessCode: 'PARTNER_BUSINESS_CAR',
                businessName: '汽车',
                businessCategoryCode: 'CAR',
                businessCategoryName: '汽车',
                contactName: '联系人',
                contactTel: '18521112231',
                contactAddress: '北京朝阳'
            }
        ],
        companyId: 120,
        totalCount: 205
    })
}

/**
 * 计划
 * @param data
 */
export async function popPlans(data: any) {
    const res = await get('/xadvert/plans', data)
    return res
}
