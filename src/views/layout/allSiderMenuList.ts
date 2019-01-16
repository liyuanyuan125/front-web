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
  },

  {
    name: 'pop',
    label: '推广管理',
    systems: ['ads', 'ps'],
    subList: [
      {
        name: 'pop-plan',
        label: '广告计划',
        systems: ['ads'],
      },
      {
        name: 'pop-planps',
        label: '广告计划',
        systems: ['ps'],
      },
      {
        name: '',
        label: '广告片',
      },
    ]
  },

  {
    name: 'report',
    label: '数据报表',
    systems: ['ads', 'ps'],
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
    systems: ['ads', 'ps'],
    subList: [
      {
        name: '',
        label: '客户列表',
      },
    ]
  },

  {
    name: 'order',
    label: '广告单管理',
    systems: ['resource'],
    subList: [
      {
        name: '',
        label: '广告单列表',
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
    systems: ['ads', 'resource', 'ps'],
    subList: [
      {
        name: 'finance-info',
        label: '财务信息',
      },
      {
        name: '',
        label: '资金账单',
      }
    ]
  },

  {
    name: 'account',
    label: '账户管理',
    systems: ['ads', 'resource', 'ps'],
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
