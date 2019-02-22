import { SystemCode } from '@/util/types'

export interface SiderMenuItem {
  name: string
  label: string
  systems?: SystemCode[]
  subList?: SiderMenuItem[]
}

/**
 * 全部左侧菜单列表，通过 systems 进行区分属于哪个「系统」
 *
 * 1、若某个菜单项没有 systems，则认为它属于全部系统
 * 2、否则，按照 systems 进行区分
 * 3、subList 中的某一项，也可能含有 systems 项
 */
const allSiderMenuList: SiderMenuItem[] = [
  {
    name: 'home',
    label: '首页',
    systems: ['ads'],
    subList: [
      {
        name: 'home-overview',
        label: '账户概览',
        systems: ['ads'],
      }
    ]
  },
  {
    name: 'home',
    label: '首页',
    systems: ['resource'],
    subList: [
      {
        name: 'home-resoverview',
        label: '账户概览',
        systems: ['resource'],
      }
    ]
  },

  {
    name: 'pop',
    label: '推广管理',
    systems: ['ads'],
    subList: [
      {
        name: 'pop-planlist',
        label: '广告计划',
        systems: ['ads'],
      },
      {
        name: 'pop-film',
        label: '广告片',
        systems: ['ads'],
      },
    ]
  },

  {
    name: 'order',
    label: '广告单管理',
    systems: ['resource'],
    subList: [
      {
        name: 'order-dispatch',
        label: '广告单',
        systems: ['resource'],
      },
      {
        name: 'order-execute',
        label: '执行单',
        systems: ['resource'],
      },
      {
        name: 'order-dcp',
        label: 'DCP包',
        systems: ['resource'],
      },
    ]
  },

  {
    name: 'report',
    label: '数据报表',
    systems: ['ads'],
    subList: [
      {
        name: 'report-plan',
        label: '投放成效报告',
      },
    ]
  },

  {
    name: 'customer',
    label: '客户管理',
    systems: ['ads'],
    subList: [
      {
        name: 'customer-list',
        label: '客户列表',
      },
    ]
  },

  {
    name: 'play',
    label: '排播管理',
    systems: ['resource'],
    subList: [
      {
        name: '',
        label: '排播列表',
      },
    ]
  },

  {
    name: 'space',
    label: '资源位管理',
    systems: ['resource'],
    subList: [
      {
        name: '',
        label: '资源位列表',
      },
    ]
  },

  {
    name: 'finance',
    label: '财务管理',
    systems: ['ads'],
    subList: [
      {
        name: 'finance-info',
        label: '财务信息',
      },
      {
        name: 'finance-bill',
        label: '资金账单',
      }
    ]
  },

  {
    name: 'resfinance',
    label: '财务管理',
    systems: ['resource'],
    subList: [
      {
        name: 'resfinance-info',
        label: '财务信息',
      },
      {
        name: 'resfinance-profitbill',
        label: '收益账单',
      },
      {
        name: 'resfinance-mouthbill',
        label: '月对账单',
      }
    ]
  },

  {
    name: 'account',
    label: '账户管理',
    systems: ['ads', 'resource'],
    subList: [
      {
        name: 'account-info',
        label: '账号信息',
      },
      {
        name: 'account-user',
        label: '用户管理',
      },
      {
        name: 'account-auth',
        label: '权限管理',
      },
      {
        name: 'account-cinema',
        systems: ['resource'],
        label: '影院管理',
      },
      {
        name: 'account-password',
        label: '修改密码',
      },
    ]
  },
]

export default allSiderMenuList
