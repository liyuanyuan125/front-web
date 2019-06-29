import { setUser, User } from '@/store'
import { SystemCode, SecondaryCode, defaultSecondaryCode } from '@/util/types'

interface SystemItem {
  code: SystemCode
  secondaryCode: SecondaryCode
  status: number
}

interface UserData {
  accountNonExpired: boolean
  accountNonLocked: boolean
  admin: boolean
  authorities: any[]
  companyId: number
  companyName: string
  credentialsNonExpired: boolean
  email: string
  enabled: boolean
  perms: string[]
  systems: SystemItem[]
  userId: number
  username: string
  accountType: number
  // systemCode 通常不会返回，应通过 postData 设置
  systemCode: SystemCode
  // 二级代理商和直客身份
  secondaryCode: SecondaryCode
}

/**
 * 使用登录或注册时返回的信息，设置用户  (data.systems || []).find(it => it.code == data.systemCode).secondaryCod
 */
export default function setUserByData(data: UserData) {
  const system = data.systems.find(it => it.code == data.systemCode)
  // 设置用户
  const user: User = {
    id: data.userId as number,
    name: data.email as string,
    email: data.email as string,
    isAdmin: data.admin as boolean,
    accountType: data.accountType as number,

    systemCode: data.systemCode as SystemCode,
    systems: (data.systems || []).filter(it => it.status == 1).map(it => it.code),
    secondaryCode: system && system.secondaryCode || defaultSecondaryCode(data.systemCode),

    companyId: data.companyId as number,
    companyName: data.companyName || '<我的公司>',

    perms: data.perms || [],
  }
  setUser(user)
}
