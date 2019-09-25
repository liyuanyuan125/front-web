/// 全局事件名列表，全部集中写在这里
import { SystemCode, SecondaryCode } from '@/util/types'

/** 系统切换 */
export const systemSwitched = 'siteSystemSwitched'

/** 系统切换事件对象 */
export interface SystemSwitchedEvent {
  systemCode: SystemCode
  secondaryCode: SecondaryCode
  oldSystemCode: SystemCode
  oldSecondaryCode: SecondaryCode
}
