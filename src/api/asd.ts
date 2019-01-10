import { get } from '@/fn/ajax'
import { mockGet, tid, title20, typeInt, dateRange } from './mock'

export async function queryList(query: any) {
  return await mockGet(query, {
    'items|20': [{
      id: tid,
      accountName: title20,
      rejectReason: title20,
      amount: title20,
      freceipt: title20,
      contactPhone: title20,
      accountNumber: title20,
      type: typeInt(1, 2),
      resType: typeInt(1, 2),
      clientLevel: 1,
      bizUserId: typeInt(1, 4),
      applyTime: dateRange(),
      remittanceDate: dateRange(),
      status: typeInt(1, 2),
    //   aptitudeStatus: typeInt(1, 3),
    }],
    totalCount: 888,
    approvalStatusList: [
      { id: 1, name: '待审核' },
      { id: 2, name: '已通过' },
      { id: 3, name: '已拒绝' },
    ],
  })
}


