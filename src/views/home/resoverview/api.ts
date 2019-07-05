/**
 * 广告主首页相关接口
 * 由于需要根据本页面，进行数据格式的转换，具有一定的特殊性，所以单独放在这里，而不是 api 中
 */

import { get } from '@/fn/ajax'

/**
 * 账户概览
 * https://yapi.aiads-dev.com/project/139/interface/api/4806
 */
export async function getStats() {
  const {
    data: {
      item: {
        balance,

        videoUnapproval,
        videoPay,
        videoTrans,
        videoCompleted,

        planOnexecute,
        planUnapproval,
        kolOnexecute,
        kolUnapproval,
        movieOnexecute,
        moviePendingDownload
      }
    }
  } = await get('/xadvert/plans/statistics')
  const result = {
    balance,

    planList: [
      { title: '映前广告', pend: planUnapproval, done: planOnexecute },
      { title: 'KOL推广', pend: kolUnapproval, done: kolOnexecute },
      { title: '影片合作', pend: moviePendingDownload, done: movieOnexecute }
    ],

    filmSummary: {
      pend: videoUnapproval,
      unpay: videoPay,
      transcoding: videoTrans,
      transcoded: videoCompleted
    }
  }
  return result
}

const makeReportList = (list: any[], valueKey: string | ((item: any) => number)) => {
  return (list || []).map(it => ({
    name: String(it.date),
    value: typeof valueKey == 'function' ? valueKey(it) : it[valueKey]
  }))
}

/**
 * 广告计划成效
 * https://yapi.aiads-dev.com/project/139/interface/api/4778
 */
export async function queryReport({
  beginDate = '',
  endDate = '',
}: any) {
  const {
    data: {
        executeScene,
        playVideo,
        executeCinema,
        advertRevenue,
    }
  } = await get('/xadvert/plans/effectStatistics', {
    accountType: 'resource',
    beginDate,
    endDate
  })
  const dataList  = await get('/xadvert/plans/effect', {
    effectType: 1,
    accountType: 'resource',
    beginDate,
    endDate
  })
  const a = dataList.data.dataList

  const result = {
    legends: [
      { name: '广告收益 / ￥', value: executeScene },
      { name: '播放广告片数', value: playVideo },
      { name: '执行影院数', value: executeCinema },
      { name: '执行场次数', value: advertRevenue },
    ],

    charts: [
      {
        title: '广告收益',
        // yAxisName: '金额 ¥',
        list: makeReportList(a, 'data')
      },

      {
        title: '播放广告片数',
        list: makeReportList(a, 'data')
      },

      {
        title: '执行影院数',
        list: makeReportList(a, 'data')
      },

      {
        title: '执行场次数',
        list: makeReportList(a, 'data')
      },
    ]
  }

  return result
}

/**
 * 获取关联的品牌列表
 * https://yapi.aiads-dev.com/project/152/interface/api/4078
 */
export async function getBrandList() {
  const {
    data: {
      items
    }
  } = await get('/brand/brand-relation/self-list', {
    pageIndex: 1,
    pageSize: 5,
  })

  const list = (items || []).map((it: any) => ({
    id: it.brandId,
    name: it.brandName,
    logo: it.logo,
  }))

  return list
}
