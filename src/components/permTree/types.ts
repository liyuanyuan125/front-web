export interface Action {
  name: string
  code: string
}

export interface Page {
  name: string
  key: string
  actions: Action[]
  subPages: Page[]
  // 标准化后会出现
  children?: Page[]
}

export interface PermTreeModal {
  menu: Page
  // perms 的每一项的格式：ads.promotion.ad-video:view
  perms: string[]
}

export interface ExtraData {
  name: string
  key: string
  actions: Action[]
  isLeaf: boolean
  level: number
  allPerms: string[]
}

export interface TreeItem {
  title: string
  expand: boolean
  checked: boolean
  indeterminate: boolean
  extraData: ExtraData
}
