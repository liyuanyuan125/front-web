export interface Action {
  name: string
  code: string
  check: boolean
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

export interface TreeItem {
  title: string
  extraData: {
    node: Page
    level: number
    perms: string[]
  }
}
