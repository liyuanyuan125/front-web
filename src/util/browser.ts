const defaultPageTitle = '鲸鱼数据'

/**
 * 设置页面标题
 * @param title 标题
 */
export function setPageTitle(title?: string) {
  document.title = title || defaultPageTitle
}
